from rest_framework import routers
from .views import StudentViewSet

router = routers.DefaultRouter()
router.register(r"", StudentViewSet, basename="student")

urlpatterns = router.urls
