from rest_framework.routers import DefaultRouter
from .views.plant_programme import PlantProgrammeViewSet

router = DefaultRouter()
router.register(r"plants-programmes", PlantProgrammeViewSet, basename="plants-programmes")

urlpatterns = router.urls