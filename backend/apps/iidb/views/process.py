from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Process
from ..serializers.process import ProcessSerializer, ProcessRowSerializer
from .mixins import ColumnsMixin
from .mixins import parse_and_validate_columns

class ProcessViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for PlantProgramme — includes automatic 'columns' endpoint from ColumnsMixin.
    """
    queryset = Process.objects.all().order_by("process_name")
    serializer_class = ProcessSerializer

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["group_processes", "subgroup_processes", "process_name", "process_resp_name", "technology_name"]
    search_fields = ["group_processes", "subgroup_processes", "process_name", "process_resp_name", "technology_name"]
    ordering_fields = ["group_processes", "subgroup_processes", "process_name", "process_resp_name", "technology_name"]
    
class ProcessRowDetailView(ColumnsMixin, RetrieveAPIView):
    """
    GET /processes/roes/<pk>/?columns=group_processes,subgroup_processes,process_name,process_resp_name,technology_name
    """
    queryset = Process.objects.all()
    serializer_class = ProcessRowSerializer
    lookup_field = "pk"
    
    def get(self, request, *args, **kargs):
        instance = self.get_object()
        
        tmp_serializer = self.get_serializer()
        available = set(tmp_serializer.fields.keys())
        only_fields = parse_and_validate_columns(request, available)
        
        serializer = self.get_serializer(instance, only_fields= only_fields)
        return Response(serializer.data)
    