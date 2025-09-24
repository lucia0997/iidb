from rest_framework.viewsets import ReadOnlyModelViewSet
from django.contrib.auth.models import Group
from .serializers import GroupSerializer
from .permissions import AppModelPermissions

class GroupListView(ReadOnlyModelViewSet):
    queryset            = Group.objects.all()
    serializer_class    = GroupSerializer
    requierd_perms      = ("edit_users")
    permission_classes  = [AppModelPermissions]   