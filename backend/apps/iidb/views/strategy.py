from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Strategy
from ..serializers.strategy import StrategySerializer, StrategyRowSerializer
from .mixins import ColumnsMixin
from .mixins import parse_and_validate_columns

class StrategyViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for PlantProgramme — includes automatic 'columns' endpoint from ColumnsMixin.
    """
    queryset = Strategy.objects.all().order_by("cosmos_dvs")
    serializer_class = StrategySerializer

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["cosmos_dvs", "cosmos_dvs_resp_name", "coc_clusters", "coc_expertise", "coc_expert_name"]
    search_fields = ["cosmos_dvs", "cosmos_dvs_resp_name", "coc_clusters", "coc_expertise", "coc_expert_name"]
    ordering_fields = ["cosmos_dvs", "cosmos_dvs_resp_name", "coc_clusters", "coc_expertise", "coc_expert_name"]
    
class StrategyRowDetailView(ColumnsMixin, RetrieveAPIView):
    """
    GET /strategies/roes/<pk>/?columns=cosmos_dvs,cosmos_dvs_resp_name,coc_clusters,coc_expertise,coc_expert_name
    """
    queryset = Strategy.objects.all()
    serializer_class = StrategyRowSerializer
    lookup_field = "pk"
    
    def get(self, request, *args, **kargs):
        instance = self.get_object()
        
        tmp_serializer = self.get_serializer()
        available = set(tmp_serializer.fields.keys())
        only_fields = parse_and_validate_columns(request, available)
        
        serializer = self.get_serializer(instance, only_fields= only_fields)
        return Response(serializer.data)
    