from rest_framework import serializers
from apps.scheduling.services import validate_appointment_window
from apps.students.serializers import StudentSerializer
from apps.users.serializers import UserSerializer
from apps.resources.serializers import CarSerializer, ClassKeySerializer, LocationSerializer
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    instructor_detail = UserSerializer(source="instructor", read_only=True)
    car_detail = CarSerializer(source="car", read_only=True)
    location_detail = LocationSerializer(source="location", read_only=True)
    class_key_detail = ClassKeySerializer(source="class_key", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "student",
            "student_detail",
            "instructor",
            "instructor_detail",
            "car",
            "car_detail",
            "location",
            "location_detail",
            "class_key",
            "class_key_detail",
            "start_at",
            "end_at",
            "status",
            "pudo",
            "no_show",
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
