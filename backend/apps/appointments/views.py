from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFromToRangeFilter
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentFilter(FilterSet):
    start_at = DateFromToRangeFilter()
    end_at = DateFromToRangeFilter()

    class Meta:
        model = Appointment
        fields = ["student", "instructor", "status", "start_at", "end_at"]


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related("student", "instructor").order_by("-start_at")
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AppointmentFilter
    search_fields = ["student__first_name", "student__last_name", "notes"]
    ordering_fields = ["start_at", "end_at", "status", "created_at"]

    @action(detail=False, methods=["post"], url_path="validate")
    def validate_window(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"valid": True}, status=status.HTTP_200_OK)
