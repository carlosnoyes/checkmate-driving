from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source="organization.name", read_only=True)
    full_name = serializers.SerializerMethodField()
    assigned_instructor_name = serializers.CharField(source="assigned_instructor.get_full_name", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "student_id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone",
            "status",
            "program_track",
            "next_drive",
            "assigned_instructor",
            "assigned_instructor_name",
            "hours_logged",
            "required_hours",
            "permit_expiration",
            "payment_status",
            "organization",
            "organization_name",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def validate_email(self, value):
        # Check for duplicate email on create
        if self.instance is None:
            if Student.objects.filter(email=value).exists():
                raise serializers.ValidationError("A student with this email already exists.")
        else:
            # On update, exclude current instance
            if Student.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("A student with this email already exists.")
        return value

    def validate_student_id(self, value):
        if not value:
            raise serializers.ValidationError("Student ID is required.")
        return value
