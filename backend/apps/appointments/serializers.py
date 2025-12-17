from rest_framework import serializers
from apps.scheduling.services import validate_appointment_window
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            "id",
            "student",
            "instructor",
            "start_at",
            "end_at",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        try:
            validate_appointment_window(
                student=data.get("student"),
                instructor=data.get("instructor"),
                start_at=data.get("start_at"),
                end_at=data.get("end_at"),
                appointment_id=self.instance.id if self.instance else None,
            )
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc
        return data
