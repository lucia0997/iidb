from rest_framework.permissions import BasePermission
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

class ActionConfigMixin:
    """
    Let the child classes define for each CRUD action:
        > serializer:
            serializer_action_classes:  { action: SerializerClass }
            default_serialzer_class     = SerializerClass
        > permissions:
            permission_action_map:      { action: ['app.perm', ...] }
    """

    def get_serializer_class(self):
        return self.serializer_aciton_classes.get(
            self.action,
            self.default_serialzer_class or super().get_serializer_class()
        )
    
    def get_permissions(self):
        perms = self.permission_action_map.get(self.action, None)
        if perms is not None:
            setattr(self, 'required_permissions', perms)

        return [perm() for perm in self.permission_classes]
    
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
                "JSONFiedl": "json",
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