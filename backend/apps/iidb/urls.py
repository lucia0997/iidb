from django.urls import path
from rest_framework.routers import DefaultRouter
from .views.plant_programme import PlantProgrammeViewSet, PlantProgrammeRowDetailView
from .views.technology import TechnologyViewSet, TechnologyRowDetailView, TRLViewSet
from .views.strategy import StrategyViewSet, StrategyRowDetailView
from .views.process import ProcessViewSet, ProcessRowDetailView
from .views.project import ProjectViewSet, ProjectRowDetailView

router = DefaultRouter()
router.register(r"plants-programmes", PlantProgrammeViewSet, basename="plants-programmes")
router.register(r"technologies", TechnologyViewSet, basename="technologies")
router.register(r"trls", TRLViewSet, basename="trls")
router.register(r"strategies", StrategyViewSet, basename="strategies")
router.register(r"processes", ProcessViewSet, basename="processes")
router.register(r"projects", ProjectViewSet, basename="projects")

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
    ),
    path(
        "strategies/rows/<int:pk>/",
        StrategyRowDetailView.as_view(),
        name="strategies-row-detail"
    ),
    path(
        "processes/rows/<int:pk>/",
        ProcessRowDetailView.as_view(),
        name="processes-row-detail"
    ),
    path(
        "projects/rows/<int:pk>/",
        ProjectRowDetailView.as_view(),
        name="projects-row-detail"
    )
]

urlpatterns += router.urls