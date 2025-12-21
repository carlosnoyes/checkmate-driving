from django.conf import settings
from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=64, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Car(models.Model):
    name = models.CharField(max_length=64, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class ClassKey(models.Model):
    key = models.CharField(max_length=32, unique=True)
    class_length_minutes = models.PositiveIntegerField()

    class Meta:
        ordering = ["key"]

    def __str__(self) -> str:
        return f"{self.key} ({self.class_length_minutes}m)"


class InstructorAvailability(models.Model):
    DAY_CHOICES = [
        ("Mon", "Mon"),
        ("Tue", "Tue"),
        ("Wed", "Wed"),
        ("Thu", "Thu"),
        ("Fri", "Fri"),
        ("Sat", "Sat"),
        ("Sun", "Sun"),
    ]
    STATUS_CHOICES = [
        ("Available", "Available"),
        ("Unavailable", "Unavailable"),
    ]

    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="availability_slots",
    )
    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.ForeignKey(
        Location,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="availability_slots",
    )
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="Available")

    class Meta:
        ordering = ["day", "start_time"]

    def __str__(self) -> str:
        return f"{self.instructor} {self.day} {self.start_time}-{self.end_time}"
