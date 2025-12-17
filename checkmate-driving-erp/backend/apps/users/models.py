from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("staff", "Staff"),
        ("instructor", "Instructor"),
    ]
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default="staff")

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
