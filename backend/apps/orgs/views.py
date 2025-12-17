from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Organization
from .serializers import OrganizationSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all().order_by("name")
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["timezone"]
    search_fields = ["name"]
    ordering_fields = ["id", "name"]
