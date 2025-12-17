"""Pure scheduling services that encapsulate validation logic."""
from datetime import datetime
from typing import Optional
from apps.appointments.models import Appointment
from .rules import has_conflict


def validate_appointment_window(
    *,
    student,
    instructor,
    start_at: datetime,
    end_at: datetime,
    appointment_id: Optional[int] = None,
) -> None:
    existing = Appointment.objects.filter(student=student)
    if appointment_id:
        existing = existing.exclude(id=appointment_id)
    times = existing.values_list("start_at", "end_at")
    if has_conflict(start_at, end_at, times):
        raise ValueError("Appointment window conflicts with an existing booking for this student.")

    if instructor:
        instructor_qs = Appointment.objects.filter(instructor=instructor)
        if appointment_id:
            instructor_qs = instructor_qs.exclude(id=appointment_id)
        instructor_times = instructor_qs.values_list("start_at", "end_at")
        if has_conflict(start_at, end_at, instructor_times):
            raise ValueError("Instructor is not available for the requested window.")
