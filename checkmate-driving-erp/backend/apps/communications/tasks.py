"""Simple task to send appointment reminders."""
from datetime import timedelta
from django.utils import timezone
from apps.appointments.models import Appointment
from .services import send_appointment_reminder


def send_upcoming_appointment_reminders(hours_ahead: int = 24) -> int:
    now = timezone.now()
    window_start = now + timedelta(hours=hours_ahead)
    window_end = window_start + timedelta(hours=1)
    queryset = Appointment.objects.filter(start_at__gte=window_start, start_at__lt=window_end)

    sent = 0
    for appointment in queryset.select_related("student"):
        student = appointment.student
        if not student.email:
            continue
        send_appointment_reminder(
            to_email=student.email,
            student_name=str(student),
            start_at=appointment.start_at,
        )
        sent += 1
    return sent
