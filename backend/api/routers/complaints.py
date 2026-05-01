from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from typing import List, Optional, Annotated
from sqlalchemy.orm import Session
from backend.models import ComplaintCreate, ComplaintResponse, ComplaintUpdate
from backend.api.deps import get_current_user, get_current_admin, get_current_student
from backend.db.database import get_db
from backend.db import models as db_models
from backend.services.ml_service import predict_category_urgency
from backend.services.email_service import send_urgent_email
from backend.services.alerts_state import get_alerts_enabled
from backend.core.config import settings

router = APIRouter()

@router.post("/", response_model=ComplaintResponse)
def create_complaint(
    complaint: ComplaintCreate,
    current_user: Annotated[db_models.User, Depends(get_current_student)],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new complaint (student or admin)."""
    # Predict category and urgency using ML service
    ml_data = predict_category_urgency(complaint.description)
    
    # Override/Set category if not provided
    if not complaint.category:
        complaint.category = ml_data["category"]
    
    # Create new complaint
    db_complaint = db_models.Complaint(
        user_id=current_user.id,
        title=complaint.title,
        description=complaint.description,
        hostel=complaint.hostel,
        block=complaint.block,
        category=complaint.category,
        status="Pending",
        urgency_score=ml_data["urgency_score"]
    )
    
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)

    alerts_enabled = get_alerts_enabled()
    should_notify = alerts_enabled and (
        (db_complaint.urgency_score or 0) >= settings.ALERT_MIN_URGENCY
        or (db_complaint.category or "") == settings.ALERT_MEDICAL_CATEGORY
    )

    if should_notify:
        subject = f"Urgent Complaint #{db_complaint.id}"
        body = (
            f"A new urgent complaint has been submitted.\n\n"
            f"Title: {db_complaint.title}\n"
            f"Category: {db_complaint.category or 'Uncategorized'}\n"
            f"Urgency: {db_complaint.urgency_score or 'N/A'}\n"
            f"Hostel: {db_complaint.hostel}{' - ' + db_complaint.block if db_complaint.block else ''}\n"
            f"Description: {db_complaint.description}\n"
            f"Reporter ID: {db_complaint.user_id}\n"
        )
        background_tasks.add_task(send_urgent_email, subject, body)
    
    return db_complaint

@router.get("/me", response_model=List[ComplaintResponse])
def read_my_complaints(
    current_user: Annotated[db_models.User, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    """Get all complaints created by the current user."""
    complaints = db.query(db_models.Complaint).filter(
        db_models.Complaint.user_id == current_user.id
    ).all()
    return complaints

@router.get("/", response_model=List[ComplaintResponse])
def read_all_complaints(
    current_user: Annotated[db_models.User, Depends(get_current_admin)],
    db: Session = Depends(get_db),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_urgency: Optional[int] = Query(None)
):
    """Get all complaints with optional filters (admin only)."""
    query = db.query(db_models.Complaint, db_models.User).join(
        db_models.User,
        db_models.Complaint.user_id == db_models.User.id,
    )
    
    if status:
        query = query.filter(db_models.Complaint.status == status)
    if category:
        query = query.filter(db_models.Complaint.category == category)
    if min_urgency:
        query = query.filter(db_models.Complaint.urgency_score >= min_urgency)

    rows = query.all()
    complaints: List[db_models.Complaint] = []
    for complaint, user in rows:
        complaint.user_phone = user.phone
        complaint.user_name = user.full_name or user.email
        complaints.append(complaint)
    return complaints

@router.patch("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(
    complaint_id: int,
    complaint_update: ComplaintUpdate,
    current_user: Annotated[db_models.User, Depends(get_current_admin)],
    db: Session = Depends(get_db)
):
    """Update complaint status (admin only)."""
    db_complaint = db.query(db_models.Complaint).filter(
        db_models.Complaint.id == complaint_id
    ).first()
    
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Update fields
    if complaint_update.status is not None:
        db_complaint.status = complaint_update.status
    if complaint_update.urgency_score is not None:
        db_complaint.urgency_score = complaint_update.urgency_score
    
    db.commit()
    db.refresh(db_complaint)
    
    return db_complaint


@router.delete("/{complaint_id}", response_model=ComplaintResponse)
def delete_complaint(
    complaint_id: int,
    current_user: Annotated[db_models.User, Depends(get_current_admin)],
    db: Session = Depends(get_db)
):
    """Delete a complaint (admin only)."""
    db_complaint = db.query(db_models.Complaint).filter(
        db_models.Complaint.id == complaint_id
    ).first()

    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    db.delete(db_complaint)
    db.commit()

    return db_complaint
