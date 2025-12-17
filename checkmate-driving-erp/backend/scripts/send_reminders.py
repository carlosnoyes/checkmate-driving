"""CLI helper to trigger reminder dispatch."""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.communications.tasks import send_upcoming_appointment_reminders  # noqa: E402


if __name__ == "__main__":
    sent = send_upcoming_appointment_reminders()
    print(f"Sent {sent} reminder(s)")
