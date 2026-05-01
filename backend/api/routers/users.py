from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.orm import Session
from backend.models import UserCreate, UserLogin, UserResponse, UserUpdate, Token
from backend.api.deps import get_current_user
from backend.db.database import get_db
from backend.db import models as db_models
from backend.core.auth import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user."""
    # Check if user already exists
    existing_user = db.query(db_models.User).filter(
        db_models.User.email == user.email
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    if user.role and user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin registration is not allowed",
        )

    db_user = db_models.User(
        email=user.email,
        hashed_password=hashed_password,
        role="student",
        full_name=user.full_name,
        semester=user.semester,
        branch=user.branch,
        phone=user.phone,
        hostel=user.hostel,
        room=user.room,
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
def login_user(
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    # Find user
    user = db.query(db_models.User).filter(
        db_models.User.email == user_credentials.email
    ).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(
    current_user: Annotated[db_models.User, Depends(get_current_user)]
):
    """Get current user profile."""
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_users_me(
    payload: UserUpdate,
    current_user: Annotated[db_models.User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """Update current user profile."""
    if payload.email and payload.email != current_user.email:
        existing_user = db.query(db_models.User).filter(
            db_models.User.email == payload.email
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = payload.email

    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.semester is not None:
        current_user.semester = payload.semester
    if payload.branch is not None:
        current_user.branch = payload.branch
    if payload.phone is not None:
        current_user.phone = payload.phone
    if payload.hostel is not None:
        current_user.hostel = payload.hostel
    if payload.room is not None:
        current_user.room = payload.room

    db.commit()
    db.refresh(current_user)

    return current_user
