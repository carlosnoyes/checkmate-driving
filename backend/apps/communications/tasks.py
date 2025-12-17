"""Simple task to send appointment reminders."""
import logging
from datetime import timedelta
from django.utils import timezone
from apps.appointments.models import Appointment
from .services import send_appointment_reminder

logger = logging.getLogger(__name__)


def send_upcoming_appointment_reminders(hours_ahead: int = 24) -> dict:
    """
    Send reminder emails for appointments happening in the specified time window.

    Args:
        hours_ahead: Number of hours ahead to look for appointments (default: 24)

    Returns:
        dict: Summary of sent/failed/skipped counts
    """
    now = timezone.now()
    window_start = now + timedelta(hours=hours_ahead)
    window_end = window_start + timedelta(hours=1)

    # Only send reminders for scheduled (not canceled/completed) appointments
    queryset = Appointment.objects.filter(
        start_at__gte=window_start,
        start_at__lt=window_end,
        status="scheduled"
    ).select_related("student")

    results = {"sent": 0, "failed": 0, "skipped": 0}

    logger.info(
        "Processing %d appointments for reminders (window: %s to %s)",
        queryset.count(),
        window_start,
        window_end
    )

    for appointment in queryset:
        student = appointment.student
        if not student.email:
            logger.debug("Skipping appointment %d: no student email", appointment.id)
            results["skipped"] += 1
            continue

        success = send_appointment_reminder(
            to_email=student.email,
            student_name=str(student),
            start_at=appointment.start_at,
        )

        if success:
            results["sent"] += 1
        else:
            results["failed"] += 1

    logger.info(
        "Reminder task completed: %d sent, %d failed, %d skipped",
        results["sent"],
        results["failed"],
        results["skipped"]
    )

    return results
