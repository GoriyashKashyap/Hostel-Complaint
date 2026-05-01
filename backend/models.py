from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    semester: Optional[str] = None
    branch: Optional[str] = None
    phone: Optional[str] = None
    hostel: Optional[str] = None
    room: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    semester: Optional[str] = None
    branch: Optional[str] = None
    phone: Optional[str] = None
    hostel: Optional[str] = None
    room: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

# Complaint schemas
class ComplaintBase(BaseModel):
    title: str
    description: str
    hostel: str
    block: Optional[str] = None
    category: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    urgency_score: Optional[int] = None

class ComplaintResponse(ComplaintBase):
    id: int
    user_id: int
    created_at: datetime
    status: str
    urgency_score: Optional[int] = None
    user_phone: Optional[str] = None
    user_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
