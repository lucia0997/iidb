from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models.technology import Technology
from ..serializers.technology import TechnologySerializer, TechnologyRowSerializer
from .mixins import ColumnsMixin, parse_and_validate_columns
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response


class TechnologyViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for Technology — includes automatic 'columns' and 'rows' endpoints from ColumnsMixin.
    """
    queryset = Technology.objects.all().order_by("technology_name")
    serializer_class = TechnologySerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "technology_cluster",
        "current_trl",
        "fom_type",
    ]

    search_fields = [
        "technology_name",
        "technology_cluster",
        "coc_expert_name",
        "product_domains",
        "technology_domains",
        "ac_application",
        "targeted_programmes",
    ]

    ordering_fields = [
        "technology_name",
        "technology_cluster",
        "current_trl",
        "fom_value_percent",
    ]
    
class TechnologyRowDetailView(ColumnsMixin, RetrieveAPIView):
    """
    GET /technologies/rows/<pk>/?columns=technology_name,technology_cluster,current_trl,...
    Returns ONLY the requested columns for a specific row.
    """
    queryset = Technology.objects.all()
    serializer_class = TechnologyRowSerializer
    lookup_field = "pk"
    
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        
        tmp_serializer = self.get_serializer()
        available = set(tmp_serializer.fields.keys())
        
        only_field = parse_and_validate_columns(request, available)
        
        if not only_field:
            serializer = self.get_serializer(instance)
        else:
            serializer = self.get_serializer(instance, only_field=only_field)
        
        return Response(serializer.data)
