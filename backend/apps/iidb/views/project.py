from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Project
from ..serializers.project import ProjectSerializer, ProjectRowSerializer
from .mixins import ColumnsMixin
from .mixins import parse_and_validate_columns

class ProjectViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for PlantProgramme — includes automatic 'columns' endpoint from ColumnsMixin.
    """
    queryset = Project.objects.all().order_by("project_name")
    serializer_class = ProjectSerializer

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["project_id", "project_name", "project_description", "programmes", "synergies", "project_start_date", "project_end_date", "project_total_cost"]
    search_fields = ["project_id", "project_name", "project_description", "programmes", "synergies", "project_start_date", "project_end_date", "project_total_cost"]
    ordering_fields = ["project_id", "project_name", "project_description", "programmes", "synergies", "project_start_date", "project_end_date", "project_total_cost"]
    
class ProjectRowDetailView(ColumnsMixin, RetrieveAPIView):
    """
    GET /projects/roes/<pk>/?columns=project_id,project_name,project_description,programmes,synergies,project_start_date,project_end_date,project_total_cost
    """
    queryset = Project.objects.all()
    serializer_class = ProjectRowSerializer
    lookup_field = "pk"
    
    def get(self, request, *args, **kargs):
        instance = self.get_object()
        
        tmp_serializer = self.get_serializer()
        available = set(tmp_serializer.fields.keys())
        only_fields = parse_and_validate_columns(request, available)
        
        serializer = self.get_serializer(instance, only_fields= only_fields)
        return Response(serializer.data)
    