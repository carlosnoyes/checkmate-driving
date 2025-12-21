from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related("organization").order_by("last_name", "first_name")
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "organization", "program_track", "payment_status", "assigned_instructor"]
    search_fields = ["student_id", "first_name", "last_name", "email", "phone"]
    ordering_fields = ["last_name", "first_name", "created_at", "status", "next_drive"]
