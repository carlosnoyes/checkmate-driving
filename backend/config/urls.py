"""Root URL configuration for the MVP."""
from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication
    path("api/auth/token/", obtain_auth_token, name="api_token_auth"),

    # API endpoints
    path("api/students/", include("apps.students.urls")),
    path("api/appointments/", include("apps.appointments.urls")),
    path("api/resources/", include("apps.resources.urls")),
    path("api/orgs/", include("apps.orgs.urls")),
    path("api/users/", include("apps.users.urls")),
]
