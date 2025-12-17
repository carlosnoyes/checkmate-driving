"""Pure scheduling services that encapsulate validation logic."""
import logging
from datetime import datetime
from typing import Optional
from apps.appointments.models import Appointment
from .rules import has_conflict

logger = logging.getLogger(__name__)


class SchedulingConflictError(ValueError):
    """Raised when an appointment conflicts with existing bookings."""
    pass


class StudentConflictError(SchedulingConflictError):
    """Raised when a student has a conflicting appointment."""
    pass


class InstructorConflictError(SchedulingConflictError):
    """Raised when an instructor has a conflicting appointment."""
    pass


def validate_appointment_window(
    *,
    student,
    instructor,
    start_at: datetime,
    end_at: datetime,
    appointment_id: Optional[int] = None,
) -> None:
    """
    Validate that an appointment window doesn't conflict with existing bookings.

    Args:
        student: The student for the appointment
        instructor: The instructor for the appointment (optional)
        start_at: Start datetime of the appointment
        end_at: End datetime of the appointment
        appointment_id: ID of existing appointment (for updates, to exclude from conflict check)

    Raises:
        StudentConflictError: If the student has a conflicting appointment
        InstructorConflictError: If the instructor has a conflicting appointment
    """
    if not student:
        raise ValueError("Student is required for appointment validation.")

    if start_at >= end_at:
        raise ValueError("Start time must be before end time.")

    # Check student conflicts - only check non-canceled appointments
    student_appointments = Appointment.objects.filter(
        student=student,
        status__in=["scheduled"]
    )
    if appointment_id:
        student_appointments = student_appointments.exclude(id=appointment_id)

    times = student_appointments.values_list("start_at", "end_at")
    if has_conflict(start_at, end_at, times):
        logger.warning(
            "Student conflict detected: student_id=%s, start=%s, end=%s",
            student.id if hasattr(student, "id") else student,
            start_at,
            end_at
        )
        raise StudentConflictError(
            "Appointment window conflicts with an existing booking for this student."
        )

    # Check instructor conflicts
    if instructor:
        instructor_appointments = Appointment.objects.filter(
            instructor=instructor,
            status__in=["scheduled"]
        )
        if appointment_id:
            instructor_appointments = instructor_appointments.exclude(id=appointment_id)

        instructor_times = instructor_appointments.values_list("start_at", "end_at")
        if has_conflict(start_at, end_at, instructor_times):
            logger.warning(
                "Instructor conflict detected: instructor_id=%s, start=%s, end=%s",
                instructor.id if hasattr(instructor, "id") else instructor,
                start_at,
                end_at
            )
            raise InstructorConflictError(
                "Instructor is not available for the requested window."
            )
