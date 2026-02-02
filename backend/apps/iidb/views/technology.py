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
    search_fields = ["technology_name", "product_roadmap", "technology_roadmap", "ac_application", "targeted_programmes"]
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

    @action(detail=False, methods=["GET"], url_path="check-name")
    def check_name(self, request):
        """
        GET /technologies/check-name/?name=<technology_name>
        
        Verifica si existe una tecnología con el nombre especificado.
        Si existe, devuelve el ID de la tecnología.
        Si no existe, devuelve null.
        """
        technology_name = request.query_params.get("name", "").strip()
        
        if not technology_name:
            return Response(
                {"detail": "El parámetro 'name' es requerido."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            technology = Technology.objects.get(technology_name=technology_name)
            return Response(
                {
                    "exists": True,
                    "id": technology.id,
                    "technology_name": technology.technology_name,
                },
                status=status.HTTP_200_OK,
            )
        except Technology.DoesNotExist:
            return Response(
                {
                    "exists": False,
                    "id": None,
                    "technology_name": technology_name,
                },
                status=status.HTTP_200_OK,
            )

    @action(detail=False, methods=["POST"], url_path="create")
    def create_technology(self, request):
        """
        POST /technologies/create/
        
        Crea una nueva tecnología o devuelve el ID si ya existe.
        El cuerpo de la petición debe contener los campos del modelo Technology.
        Para los TRLs, el backend acepta una lista de objetos con la forma:

        "trls": [
            {"trl_number": 1, "trl_year": 2024, "trl_cost": 1000},
            {"trl_number": 2, "trl_year": 2025, "trl_cost": 2000}
        ]

        Internamente, estos TRLs se crean (o se reutilizan si ya existen)
        y se asocian a la tecnología.
        
        Respuesta:
        - Si la tecnología ya existe: devuelve el ID existente y "created": false
        - Si se crea nueva: devuelve el ID nuevo y "created": true
        """
        data = request.data.copy()

        technology_name = data.get("technology_name", "").strip()
        
        if not technology_name:
            return Response(
                {"detail": "El campo 'technology_name' es requerido."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Verificar si ya existe
        try:
            existing_technology = Technology.objects.get(technology_name=technology_name)
            serializer = self.get_serializer(existing_technology)
            return Response(
                {
                    "created": False,
                    "id": existing_technology.id,
                    "technology": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Technology.DoesNotExist:
            # No existe, crear nueva
            # 1) Procesar TRLs anidados si vienen como lista de objetos
            trls_payload = data.get("trls", None)
            trl_instances = []

            if isinstance(trls_payload, list):
                for trl_item in trls_payload:
                    # Esperamos diccionarios con trl_number obligatorio
                    trl_number = trl_item.get("trl_number")
                    trl_year = trl_item.get("trl_year")
                    trl_cost = trl_item.get("trl_cost")

                    if trl_number is None:
                        return Response(
                            {
                                "detail": "Cada elemento de 'trls' debe incluir 'trl_number'.",
                                "item": trl_item,
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    # Buscar solo por trl_number (campo único/identificador)
                    # Si existe, actualizar año y costo si se proporcionan
                    # Si no existe, crearlo con todos los valores
                    trl_obj, created = TRL.objects.get_or_create(
                        trl_number=trl_number,
                        defaults={
                            "trl_year": trl_year,
                            "trl_cost": trl_cost,
                        },
                    )
                    
                    # Si ya existía, actualizar los campos opcionales si se proporcionaron
                    if not created:
                        if trl_year is not None:
                            trl_obj.trl_year = trl_year
                        if trl_cost is not None:
                            trl_obj.trl_cost = trl_cost
                        trl_obj.save()
                    
                    trl_instances.append(trl_obj)

                # Sustituimos el payload original por la lista de IDs
                data["trls"] = [t.id for t in trl_instances]

            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                technology = serializer.save()
                return Response(
                    {
                        "created": True,
                        "id": technology.id,
                        "technology": serializer.data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "detail": "Error de validación al crear la tecnología.",
                        "errors": serializer.errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

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