from datetime import time
from django.db import models


class Organization(models.Model):
    name = models.CharField(max_length=255)
    timezone = models.CharField(max_length=64, default="UTC")
    business_hours_start = models.TimeField(default=time(8, 0))
    business_hours_end = models.TimeField(default=time(17, 0))

    def __str__(self) -> str:
        return self.name
