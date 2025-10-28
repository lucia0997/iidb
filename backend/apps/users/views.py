from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .serializers import UserSerializer, UserListSerializer
from apps.authentication.serializers import UserCreateSerializer
from apps.core.mixins import ActionConfigMixin
from apps.authorization.permissions import AppModelPermissions
from .filters import UserFilter

User = get_user_model()

class UserViewSet(ActionConfigMixin, ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
    queryset = User.objects.all().prefetch_related("groups").order_by("username")
    # lookup_field = "username"         # lookup_field is by default set to the model key.

    serializer_action_classes = {
        "list":                 UserListSerializer,
        "retrieve":             UserSerializer,
        "create":               UserCreateSerializer,
        "update":               UserSerializer, 
        "partial_update":       UserSerializer,
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
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["username", "first_name", "last_name", "email", "full_name"]
    ordering_fields = ["username", "full_name", "email", "is_active", "date_joined"]

    def get_serializer_class(self):
        return self.serializer_action_classes.get(self.action, self.default_serializer_class)

    def get_permissions(self):
        perms = self.permission_action_map.get(self.action)
        if perms:
            self.required_permissions = perms
        return [pc() for pc in self.permission_classes]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request and any(k.startswith("groups") for k in self.request.query_params.keys()):
            qs = qs.distinct()
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        read_serializer = UserSerializer(user, context=self.get_serializer_context())
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
