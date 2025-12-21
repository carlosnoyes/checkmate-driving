from django.db import models


class Student(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("paused", "Paused"),
        ("graduated", "Graduated"),
        ("completed", "Completed"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("paid", "Paid"),
        ("pending", "Pending"),
        ("overdue", "Overdue"),
    ]

    student_id = models.CharField(max_length=32, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="active")
    program_track = models.CharField(max_length=128, blank=True)
    next_drive = models.DateField(null=True, blank=True)
    assigned_instructor = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        related_name="assigned_students",
        null=True,
        blank=True,
    )
    hours_logged = models.PositiveIntegerField(default=0)
    required_hours = models.PositiveIntegerField(default=20)
    permit_expiration = models.DateField(null=True, blank=True)
    payment_status = models.CharField(max_length=32, choices=PAYMENT_STATUS_CHOICES, default="pending")
    organization = models.ForeignKey(
        "orgs.Organization",
        on_delete=models.CASCADE,
        related_name="students",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()
