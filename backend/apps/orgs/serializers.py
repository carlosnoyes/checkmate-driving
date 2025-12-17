from zoneinfo import ZoneInfo
from rest_framework import serializers
from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ["id", "name", "timezone", "business_hours_start", "business_hours_end", "student_count"]
        read_only_fields = ["id"]

    def get_student_count(self, obj):
        return obj.students.count()

    def validate_timezone(self, value):
        try:
            ZoneInfo(value)
        except Exception:
            raise serializers.ValidationError(f"Invalid timezone: {value}")
        return value

    def validate(self, data):
        start = data.get("business_hours_start")
        end = data.get("business_hours_end")

        if start and end and start >= end:
            raise serializers.ValidationError({
                "business_hours_end": "Business hours end must be after start."
            })

        return data
