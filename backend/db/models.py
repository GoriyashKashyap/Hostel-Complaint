from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from backend.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student")  # student or admin
    full_name = Column(String, nullable=True)
    semester = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    hostel = Column(String, nullable=True)
    room = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    hostel = Column(String, nullable=False)
    block = Column(String, nullable=True)
    category = Column(String, nullable=True)
    status = Column(String, default="Pending")  # Pending, In Progress, Resolved
    urgency_score = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
