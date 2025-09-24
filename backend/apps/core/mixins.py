from rest_framework.permissions import BasePermission
from rest_framework.viewsets import ModelViewSet

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