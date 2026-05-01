
import json

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import ClassVar, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Hostel Issue Reporting System"
    API_V1_STR: str = "/api/v1"
    SUPABASE_URL: str = "not_used"
    SUPABASE_KEY: str = "not_used"
    
    # Local Database
    DATABASE_URL: str = "sqlite:///./backend/hostel_issues.db"
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:8000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            if not value.strip():
                return []
            if value.strip().startswith("["):
                try:
                    parsed = json.loads(value)
                    if isinstance(parsed, list):
                        return parsed
                except json.JSONDecodeError:
                    pass
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    # Email alerts (optional)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""
    ALERT_EMAILS: str = ""  # Comma-separated recipients
    ALERT_MIN_URGENCY: int = 8
    ALERT_MEDICAL_CATEGORY: str = "Medical Emergency"

    model_config = SettingsConfigDict(env_file=[".env", "backend/.env"], case_sensitive=True, extra="ignore")

settings = Settings()
