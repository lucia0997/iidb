from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import PlantProgramme
from ..serializers.plant_programme import PlantProgrammeSerializer, PlantProgrammeRowSerializer
from .mixins import ColumnsMixin
from .mixins import parse_and_validate_columns

class PlantProgrammeViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for PlantProgramme — includes automatic 'columns' endpoint from ColumnsMixin.
    """
    queryset = PlantProgramme.objects.all().order_by("technology_name")
    serializer_class = PlantProgrammeSerializer

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["business", "site"]
    search_fields = ["technology_name", "program", "business", "site"]
    ordering_fields = ["technology_name", "business", "site"]
    
class PlantProgrammeRowDetailView(ColumnsMixin, RetrieveAPIView):
    """
    GET /plants-programmes/roes/<pk>/?columns=technology-name,program,business,site
    """
    queryset = PlantProgramme.objects.all()
    serializer_class = PlantProgrammeRowSerializer
    lookup_field = "pk"
    
    def get(self, request, *args, **kargs):
        instance = self.get_object()
        
        tmp_serializer = self.get_serializer()
        available = set(tmp_serializer.fields.keys())
        only_fields = parse_and_validate_columns(request, available)
        
        serializer = self.get_serializer(instance, only_fields= only_fields)
        return Response(serializer.data)
    