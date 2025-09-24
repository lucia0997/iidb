from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model

from .serializers import UserSerializer, UserUpdateSerializer
from apps.authentication.serializers import UserCreateSerializer
from apps.core.mixins import ActionConfigMixin
from apps.authorization.permissions import AppModelPermissions
from .filters import UserFilter

User = get_user_model()

class UserViewSet(ActionConfigMixin, ModelViewSet):
    queryset = User.objects.all()
    # lookup_field = "username"         # lookup_field is by default set to the model key.

    serializer_action_classes = {
        "list":                 UserSerializer,
        "retrieve":             UserSerializer,
        "create":               UserCreateSerializer,
        "update":               UserUpdateSerializer, 
        "partial_update":       UserUpdateSerializer,
    }
    default_serializer_class =  UserSerializer

    permission_classes = [AppModelPermissions]
    permission_action_map = {
        "list":                 ['users.view_users'],
        "retrieve":             ['users.view_users'],
        "create":               ['users.edit_users'],
        "update":               ['users.edit_users'], 
        "partial_update":       ['users.edit_users'],
        "destroy":              ['users.edit_users'],
    }

    filterset_class = UserFilter
    ordering_fields = "__all__"
