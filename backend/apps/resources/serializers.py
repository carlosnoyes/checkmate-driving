from rest_framework import serializers
from .models import Car, ClassKey, InstructorAvailability, Location


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "name"]


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ["id", "name"]


class ClassKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassKey
        fields = ["id", "key", "class_length_minutes"]


class InstructorAvailabilitySerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.get_full_name", read_only=True)
    location_name = serializers.CharField(source="location.name", read_only=True)

    class Meta:
        model = InstructorAvailability
        fields = [
            "id",
            "instructor",
            "instructor_name",
            "day",
            "start_time",
            "end_time",
            "location",
            "location_name",
            "status",
        ]
