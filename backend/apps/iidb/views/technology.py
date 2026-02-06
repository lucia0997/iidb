from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError
import logging
from ..models.technology import Technology, TRL
from ..serializers.technology import TechnologySerializer, TechnologyRowSerializer, TRLSerializer, TechnologyWithTRLsSerializer
from .mixins import ColumnsMixin, parse_and_validate_columns
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class TechnologyViewSet(ColumnsMixin, viewsets.ModelViewSet):
    """
    ViewSet for Technology — includes automatic 'columns' and 'rows' endpoints from ColumnsMixin.
    """
    queryset = Technology.objects.prefetch_related('fom_type', 'targeted_programmes', 'trls').all().order_by("technology_name")
    serializer_class = TechnologySerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["current_trl", "fom_type", "physical_technology_cluster", "digital_technology_cluster", "product_roadmap", "technology_roadmap", "ac_application"]
    search_fields = ["technology_name", "product_roadmap__name", "technology_roadmap__name", "ac_application__name", "fom_type__name", "targeted_programmes__name", "physical_technology_cluster__name", "digital_technology_cluster__name"]
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
                self.get_queryset().prefetch_related("trls", "fom_type", "targeted_programmes")
            )
            page = self.paginate_queryset(qs)

            if page is not None:
                serializer = TechnologyWithTRLsSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = TechnologyWithTRLsSerializer(qs, many=True)
            return Response(serializer.data)

        # Sin TRLs: usar TechnologyRowSerializer para devolver nombres en lugar de IDs
        qs = self.filter_queryset(
            self.get_queryset().prefetch_related("fom_type", "targeted_programmes")
        )
        
        # Validar columnas solicitadas
        serializer = TechnologyRowSerializer()
        allowed = set(serializer.fields.keys())
        invalid = [c for c in requested if c not in allowed]
        if invalid:
            return Response(
                {"detail": "Invalid columns", "invalid": invalid,
                    "allowed": sorted(list(allowed))},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Siempre incluir 'id' si no está en la solicitud
        if "id" in allowed and "id" not in requested:
            requested = ["id"] + requested
        
        # Serializar con solo las columnas solicitadas
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = TechnologyRowSerializer(page, many=True, only_fields=requested)
            data = serializer.data
            # Filtrar solo las columnas solicitadas en cada fila
            filtered_data = [
                {k: v for k, v in row.items() if k in requested}
                for row in data
            ]
            return self.get_paginated_response(filtered_data)
        
        serializer = TechnologyRowSerializer(qs, many=True, only_fields=requested)
        data = serializer.data
        # Filtrar solo las columnas solicitadas en cada fila
        filtered_data = [
            {k: v for k, v in row.items() if k in requested}
            for row in data
        ]
        return Response(filtered_data)

    @action(detail=False, methods=["GET"], url_path="list-simple")
    def list_simple(self, request):
        """
        GET /technologies/list-simple/
        
        Devuelve una lista simple de tecnologías con solo id y technology_name.
        Útil para selectores y dropdowns.
        """
        technologies = Technology.objects.all().order_by("technology_name").values("id", "technology_name")
        return Response(list(technologies), status=status.HTTP_200_OK)

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
                {"detail": "The 'name' parameter is required."},
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
    @transaction.atomic
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
        try:
            data = request.data.copy()

            technology_name = data.get("technology_name", "").strip()
            
            if not technology_name:
                return Response(
                    {"detail": "The 'technology_name' field is required."},
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
                        try:
                            # Esperamos diccionarios con trl_number obligatorio
                            trl_number = trl_item.get("trl_number")
                            trl_year = trl_item.get("trl_year")
                            trl_cost = trl_item.get("trl_cost")

                            # Validar y convertir tipos
                            if trl_number is None:
                                return Response(
                                    {
                                        "detail": "Each 'trls' element must include 'trl_number'.",
                                        "item": trl_item,
                                    },
                                    status=status.HTTP_400_BAD_REQUEST,
                                )
                            
                            # Convertir a enteros si vienen como strings
                            if isinstance(trl_number, str):
                                try:
                                    trl_number = int(trl_number)
                                except (ValueError, TypeError):
                                    return Response(
                                        {
                                            "detail": f"trl_number must be an integer. Received value: {trl_number}",
                                            "item": trl_item,
                                        },
                                        status=status.HTTP_400_BAD_REQUEST,
                                    )
                            
                            if isinstance(trl_year, str) and trl_year:
                                try:
                                    trl_year = int(trl_year)
                                except (ValueError, TypeError):
                                    return Response(
                                        {
                                            "detail": f"trl_year must be an integer. Received value: {trl_year}",
                                            "item": trl_item,
                                        },
                                        status=status.HTTP_400_BAD_REQUEST,
                                    )
                            
                            # Convertir trl_cost a Decimal si viene como string o número
                            from decimal import Decimal, InvalidOperation
                            trl_cost_decimal = None
                            if trl_cost is not None:
                                try:
                                    if isinstance(trl_cost, str):
                                        trl_cost_decimal = Decimal(trl_cost)
                                    elif isinstance(trl_cost, (int, float)):
                                        trl_cost_decimal = Decimal(str(trl_cost))
                                    else:
                                        trl_cost_decimal = trl_cost
                                except (ValueError, InvalidOperation, TypeError):
                                    return Response(
                                        {
                                            "detail": f"trl_cost must be a valid number. Received value: {trl_cost}",
                                            "item": trl_item,
                                        },
                                        status=status.HTTP_400_BAD_REQUEST,
                                    )

                            # Buscar por trl_number Y trl_year (combinación única)
                            # Si existe, actualizar costo si se proporciona
                            # Si no existe, crearlo con todos los valores
                            trl_obj = None
                            if trl_year is not None:
                                # Buscar por trl_number y trl_year
                                trl_obj = TRL.objects.filter(
                                    trl_number=trl_number,
                                    trl_year=trl_year
                                ).first()
                            
                            if trl_obj:
                                # Si existe, actualizar el costo si se proporciona
                                if trl_cost_decimal is not None:
                                    trl_obj.trl_cost = trl_cost_decimal
                                    trl_obj.save()
                            else:
                                # Si no existe, crear uno nuevo
                                trl_obj = TRL.objects.create(
                                    trl_number=trl_number,
                                    trl_year=trl_year,
                                    trl_cost=trl_cost_decimal,
                                )
                            
                            trl_instances.append(trl_obj)
                        except Exception as e:
                            return Response(
                                {
                                    "detail": f"Error processing TRL: {str(e)}",
                                    "item": trl_item,
                                },
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                # Sustituimos el payload original por la lista de IDs (campo write-only trls_ids)
                data["trls_ids"] = [t.id for t in trl_instances]

                serializer = self.get_serializer(data=data)
                if serializer.is_valid():
                    try:
                        technology = serializer.save()
                        # Intentar serializar la respuesta para detectar errores temprano
                        try:
                            technology_data = serializer.data
                        except Exception as serialization_error:
                            logger.error(f"Error serializing technology after saving: {str(serialization_error)}", exc_info=True)
                            raise
                        
                        return Response(
                            {
                                "created": True,
                                "id": technology.id,
                                "technology": technology_data,
                            },
                            status=status.HTTP_201_CREATED,
                        )
                    except Exception as save_error:
                        logger.error(f"Error saving technology: {str(save_error)}", exc_info=True)
                        # La transacción hará rollback automáticamente
                        return Response(
                            {
                                "detail": f"Error saving technology: {str(save_error)}",
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
                else:
                    return Response(
                        {
                            "detail": "Validation error when creating technology.",
                            "errors": serializer.errors,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        except Exception as e:
            logger.error(f"Unexpected error in create_technology: {str(e)}", exc_info=True)
            # La transacción hará rollback automáticamente
            return Response(
                {
                    "detail": f"Unexpected error: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class TechnologyRowDetailView(ColumnsMixin, RetrieveAPIView):
    """
    GET /technologies/rows/<pk>/?columns=technology_name,product_domains,current_trl,...
    Returns ONLY the requested columns for a specific row.
    """
    queryset = Technology.objects.prefetch_related('fom_type', 'targeted_programmes').all()
    serializer_class = TechnologyRowSerializer
    lookup_field = "pk"
    
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        
        tmp_serializer = self.get_serializer()
        available = set(tmp_serializer.fields.keys())
        
        only_fields = parse_and_validate_columns(request, available)
        
        if not only_fields:
            serializer = self.get_serializer(instance)
        else:
            serializer = self.get_serializer(instance, only_fields=only_fields)
        
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