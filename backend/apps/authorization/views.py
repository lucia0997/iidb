from rest_framework.viewsets import ReadOnlyModelViewSet
from django.contrib.auth.models import Group
from .serializers import GroupSerializer
from .permissions import AppModelPermissions

class GroupListView(ReadOnlyModelViewSet):
    queryset            = Group.objects.order_by("name")
    serializer_class    = GroupSerializer
    permission_classes  = [AppModelPermissions]   
    
    required_permissions = ["users.view_users"]