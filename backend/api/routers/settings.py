from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Annotated

from backend.api.deps import get_current_admin
from backend.db import models as db_models
from backend.services.alerts_state import get_alerts_enabled, set_alerts_enabled


router = APIRouter()


class AlertSettings(BaseModel):
    enabled: bool


@router.get("/alerts", response_model=AlertSettings)
def read_alert_settings(
    current_user: Annotated[db_models.User, Depends(get_current_admin)],
):
    return {"enabled": get_alerts_enabled()}


@router.patch("/alerts", response_model=AlertSettings)
def update_alert_settings(
    payload: AlertSettings,
    current_user: Annotated[db_models.User, Depends(get_current_admin)],
):
    return {"enabled": set_alerts_enabled(payload.enabled)}