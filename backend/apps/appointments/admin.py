from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("student", "instructor", "start_at", "end_at", "status")
    list_filter = ("status",)
    search_fields = ("student__first_name", "student__last_name", "notes")
