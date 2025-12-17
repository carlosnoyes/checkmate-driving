"""Email and notification helpers."""
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def send_appointment_reminder(*, to_email: str, student_name: str, start_at) -> bool:
    """
    Send an appointment reminder email.

    Args:
        to_email: The recipient's email address
        student_name: The student's name for personalization
        start_at: The appointment start datetime

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    subject = "Appointment Reminder - Checkmate Driving"

    try:
        html_message = render_to_string(
            "communications/reminder_email.html",
            {"student_name": student_name, "start_at": start_at},
        )
    except Exception as e:
        logger.error("Failed to render email template: %s", e)
        html_message = None

    plain_message = f"Hi {student_name}, your appointment is scheduled for {start_at}."

    try:
        sent = send_mail(
            subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            html_message=html_message,
            fail_silently=False,
        )
        if sent:
            logger.info("Appointment reminder sent to %s for %s", to_email, start_at)
            return True
        else:
            logger.warning("Email send returned 0 for %s", to_email)
            return False
    except Exception as e:
        logger.error("Failed to send appointment reminder to %s: %s", to_email, e)
        return False
