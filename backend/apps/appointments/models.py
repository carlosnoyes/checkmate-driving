from django.conf import settings
from django.db import models
from apps.resources.models import Car, ClassKey, Location


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("canceled", "Canceled"),
    ]

    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, related_name="appointments"
    )
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="appointments",
        null=True,
        blank=True,
    )
    car = models.ForeignKey(
        Car,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="appointments",
    )
    location = models.ForeignKey(
        Location,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="appointments",
    )
    class_key = models.ForeignKey(
        ClassKey,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="appointments",
    )
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="scheduled")
    pudo = models.BooleanField(default=False)
    no_show = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_at"]
        indexes = [
            models.Index(fields=["start_at", "end_at"]),
        ]

    def __str__(self) -> str:
        student_name = self.student.__str__()
        return f"{student_name} @ {self.start_at.isoformat()}"
