from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Car, ClassKey, InstructorAvailability, Location
from .serializers import (
    CarSerializer,
    ClassKeySerializer,
    InstructorAvailabilitySerializer,
    LocationSerializer,
)


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name"]


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name"]


class ClassKeyViewSet(viewsets.ModelViewSet):
    queryset = ClassKey.objects.all()
    serializer_class = ClassKeySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["key"]
    ordering_fields = ["key", "class_length_minutes"]


class InstructorAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = InstructorAvailability.objects.select_related("instructor", "location")
    serializer_class = InstructorAvailabilitySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["instructor", "day", "location", "status"]
    search_fields = ["instructor__first_name", "instructor__last_name"]
    ordering_fields = ["day", "start_time", "end_time"]
