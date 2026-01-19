from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models.technology import Technology, TRL
from ..serializers.technology import TechnologySerializer, TechnologyRowSerializer, TRLSerializer, TechnologyWithTRLsSerializer
from .mixins import ColumnsMixin, parse_and_validate_columns
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response


class TechnologyViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for Technology — includes automatic 'columns' and 'rows' endpoints from ColumnsMixin.
    """
    queryset = Technology.objects.all().order_by("technology_name")
    serializer_class = TechnologySerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["current_trl", "fom_type"]
    search_fields = ["technology_name", "product_domains", "technology_domains", "ac_application", "targeted_programmes"]
    ordering_fields = ["technology_name", "current_trl", "fom_value_percent"]

    @action(detail=False, methods=["GET"], url_path="rows")
    def rows(self, request):
        """
        GET /technologies/rows/

        - Si se pide alguna columna TRL (trlX_year / trlX_cost) o la columna lógica 'trls',
          devolvemos todas las columnas de Technology + las 18 columnas de años y costes TRL
          usando TechnologyWithTRLsSerializer.
        - En caso contrario, usamos el comportamiento genérico de ColumnsMixin (proyección por columnas).
        """
        raw = request.query_params.get("columns", "")
        requested = [c.strip() for c in raw.split(",") if c.strip()]

        if not requested:
            return Response(
                {"detail": "You must select at least one column."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        wants_trls = any(
            col == "trls" or col.startswith("trl")
            for col in requested
        )

        if wants_trls:
            qs = self.filter_queryset(
                self.get_queryset().prefetch_related("trls")
            )
            page = self.paginate_queryset(qs)

            if page is not None:
                serializer = TechnologyWithTRLsSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = TechnologyWithTRLsSerializer(qs, many=True)
            return Response(serializer.data)

        # Sin TRLs: comportamiento estándar
        return ColumnsMixin.rows(self, request)

class TechnologyRowDetailView(ColumnsMixin, RetrieveAPIView):
    """
    GET /technologies/rows/<pk>/?columns=technology_name,product_domains,current_trl,...
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

class TRLViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for TRL — includes automatic 'columns' endpoint from ColumnsMixin.
    """
    queryset = TRL.objects.all().order_by("trl_number")
    serializer_class = TRLSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["trl_number", "trl_year", "trl_cost"]
    search_fields = ["trl_number", "trl_year", "trl_cost"]
    ordering_fields = ["trl_number", "trl_year", "trl_cost"]