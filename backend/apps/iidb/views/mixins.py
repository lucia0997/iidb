from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
    
class ColumnsMixin:
    @action(detail=False, methods=["GET"], url_path="columns")
    def columns(self, request):
        serializer = self.get_serializer()
        model = self.get_queryset().model
        
        fields_meta = []
        for name, field in serializer.fields.items():
            if name in ("id",):
                continue
            
            try:
                model_field = model._meta.get_field(name)
                verbose = getattr(model_field, "verbose_name", name)
            except Exception:
                verbose = name
                
            label = getattr(field, "label", None) or str(verbose).title()
            
            type_map = {
                "CharField": "string",
                "IntegerField": "number",
                "FloatField": "number",
                "BooleanField": "boolean",
                "JSONField": "json",
                "ListField": "array"
            }
            field_type = type_map.get(field.__class__.__name__, field.__class__.__name__)
            
            fields_meta.append({
                "key": name,
                "label": label,
                "type": field_type,
                "filterable": name in getattr(self, "filterset_fields", []),
                "searchable": name in getattr(self, "search_fields", []),
                "orderable": name in getattr(self, "ordering_fields", [])
            })
        
        return Response(fields_meta)
    
    @action(detail=False, methods=["GET"], url_path="rows")
    def rows(self, request):
        """
         GET /api/<basename>/rows/?columns=col1,col2&ordering=col1,-col2&page=1&page_size=200
         Returns all projected rows in the requested columns.
         Respects filters, sorting, and search settings configured in the ViewSet. 
        """
        
        # 1) Requested columns
        raw = request.query_params.get("columns", "")
        requested = [c.strip() for c in raw.split(",") if c.strip()]
        
        if not requested:
            return Response(
                {"detail": "You must select at least one column."},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        # 2) Columns allowed according to the current serializer
        serializer = self.get_serializer()
        allowed = set(serializer.fields.keys())
        
        # 3) Validate columns
        invalid = [c for c in requested if c not in allowed]
        if invalid:
            return Response(
                {"detail": "Invalid columns", "invalid": invalid, "allowed": sorted(list(allowed))},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        # 4) Always include 'id' for detailed navigation
        if "id" in allowed and "id" not in requested:
            requested = ["id"] + requested
            
        # 5) Apply filters/sorting/search already configured in your ViewSet
        # (filter_backends, filterset_fields, search_fields, ordering_fields)
        qs = self.filter_queryset(self.get_queryset())
        
        # 6)Optimize I/O and project columns
        try: 
            # only() helps the ORM avoid loading unused columns into instances.
            qs = qs.only(*[c for c in requested if c != "id"])
        except Exception:
            pass
        
        qs_values = qs_values(*requested)
        
        #7) Standard DRF pagination in custom actions
        page = self.paginate_queryset(qs_values)
        if page is not None:
            return self.get_paginated_response(page)
        
        return Response(list(qs_values))
            