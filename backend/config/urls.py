"""Root URL configuration for the MVP."""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/students/", include("apps.students.urls")),
    path("api/appointments/", include("apps.appointments.urls")),
    path("api/orgs/", include("apps.orgs.urls")),
    path("api/users/", include("apps.users.urls")),
]
