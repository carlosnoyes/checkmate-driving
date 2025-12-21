from django.contrib import admin
from .models import Car, ClassKey, InstructorAvailability, Location


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(ClassKey)
class ClassKeyAdmin(admin.ModelAdmin):
    list_display = ("key", "class_length_minutes")


@admin.register(InstructorAvailability)
class InstructorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ("instructor", "day", "start_time", "end_time", "location", "status")
    list_filter = ("day", "status", "location")
