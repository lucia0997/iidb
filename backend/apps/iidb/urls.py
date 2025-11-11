from django.urls import path
from rest_framework.routers import DefaultRouter
from .views.plant_programme import PlantProgrammeViewSet, PlantProgrammeRowDetailView

router = DefaultRouter()
router.register(r"plants-programmes", PlantProgrammeViewSet, basename="plants-programmes")

urlpatterns = [
    path(
        "plants-programmes/rows/<int:pk>/",
        PlantProgrammeRowDetailView.as_view(),
        name="plants-programmes-row-detail"
    )
]

urlpatterns += router.urls