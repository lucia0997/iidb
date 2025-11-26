from django.urls import path
from rest_framework.routers import DefaultRouter
from .views.plant_programme import PlantProgrammeViewSet, PlantProgrammeRowDetailView
from .views.technology import TechnologyViewSet, TechnologyRowDetailView

router = DefaultRouter()
router.register(r"plants-programmes", PlantProgrammeViewSet, basename="plants-programmes")
router.register(r"technologies", TechnologyViewSet, basename="technologies")

urlpatterns = [
    path(
        "plants-programmes/rows/<int:pk>/",
        PlantProgrammeRowDetailView.as_view(),
        name="plants-programmes-row-detail"
    ),
    path(
        "technologies/rows/<int:pk>/",
        TechnologyRowDetailView.as_view(),
        name="technologies-row-detail"
    )
]

urlpatterns += router.urls