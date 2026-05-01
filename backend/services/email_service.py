from __future__ import annotations

import smtplib
from email.message import EmailMessage
from typing import Iterable

from backend.core.config import settings


def _get_recipients() -> list[str]:
    recipients = [email.strip() for email in settings.ALERT_EMAILS.split(",") if email.strip()]
    return recipients


def send_urgent_email(subject: str, body: str, recipients: Iterable[str] | None = None) -> None:
    if not settings.SMTP_HOST or not settings.SMTP_FROM:
        return

    recipient_list = list(recipients) if recipients is not None else _get_recipients()
    if not recipient_list:
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.SMTP_FROM
    message["To"] = ", ".join(recipient_list)
    message.set_content(body)

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
        smtp.starttls()
        if settings.SMTP_USERNAME:
            smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        smtp.send_message(message)
