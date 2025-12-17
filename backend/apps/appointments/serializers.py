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
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, data):
        # For updates, get existing values if not provided in data
        student = data.get("student")
        instructor = data.get("instructor")
        start_at = data.get("start_at")
        end_at = data.get("end_at")

        # On update, fallback to instance values for fields not being changed
        if self.instance:
            student = student or self.instance.student
            instructor = instructor if "instructor" in data else self.instance.instructor
            start_at = start_at or self.instance.start_at
            end_at = end_at or self.instance.end_at

        # Validate required fields
        if not student:
            raise serializers.ValidationError({"student": "This field is required."})
        if not start_at:
            raise serializers.ValidationError({"start_at": "This field is required."})
        if not end_at:
            raise serializers.ValidationError({"end_at": "This field is required."})

        # Validate end_at is after start_at
        if end_at <= start_at:
            raise serializers.ValidationError({"end_at": "End time must be after start time."})

        try:
            validate_appointment_window(
                student=student,
                instructor=instructor,
                start_at=start_at,
                end_at=end_at,
                appointment_id=self.instance.id if self.instance else None,
            )
        except ValueError as exc:
            raise serializers.ValidationError({"non_field_errors": [str(exc)]}) from exc
        return data
