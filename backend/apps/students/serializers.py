from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source="organization.name", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone",
            "status",
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
