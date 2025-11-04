from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import PlantProgramme
from ..serializers.plant_programme import PlantProgrammeSerializer
from apps.core.mixins import ColumnsMixin


class PlantProgrammeViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for PlantProgramme — includes automatic 'columns' endpoint from ColumnsMixin.
    """
    queryset = PlantProgramme.objects.all().order_by("technology_name")
    serializer_class = PlantProgrammeSerializer

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["business", "site"]
    search_fields = ["technology_name", "business", "site"]
    ordering_fields = ["technology_name", "business", "site"]