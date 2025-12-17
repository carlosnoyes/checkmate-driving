"""Email and notification helpers."""
from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_appointment_reminder(*, to_email: str, student_name: str, start_at) -> None:
    subject = "Appointment Reminder"
    html_message = render_to_string(
        "communications/reminder_email.html",
        {"student_name": student_name, "start_at": start_at},
    )
    send_mail(
        subject,
        message="Your appointment is coming up.",
        from_email=None,
        recipient_list=[to_email],
        html_message=html_message,
        fail_silently=True,
    )
