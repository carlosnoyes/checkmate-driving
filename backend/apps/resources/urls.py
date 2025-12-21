from rest_framework import routers
from .views import CarViewSet, ClassKeyViewSet, InstructorAvailabilityViewSet, LocationViewSet

router = routers.DefaultRouter()
router.register(r"locations", LocationViewSet, basename="location")
router.register(r"cars", CarViewSet, basename="car")
router.register(r"class-keys", ClassKeyViewSet, basename="class-key")
router.register(r"instructor-availability", InstructorAvailabilityViewSet, basename="instructor-availability")

urlpatterns = router.urls
