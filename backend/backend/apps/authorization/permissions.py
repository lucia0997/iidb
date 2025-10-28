from rest_framework.permissions import DjangoModelPermissions


class AppModelPermissions(DjangoModelPermissions):
    """
    Custom permission class extending DjangoModelPermissions to include the "view"
    permission for HTTP GET requests.

    It also allows to create custom permissions in the views and overwrite the CRUD permissions.
    
    To use this custom permission class, add it to the permission_classes
    of a DRF view or viewset:

    Examples:

        · CRUD PERMISSIONS
            class MyViewSet(viewsets.ModelViewSet):
                queryset = MyModel.objects.all()
                serializer_class = MySerializer
                permission_classes = [DjangoModelPermission]

        · CUSTOM PERMISSIONS
            class MyModel(models.Model):
                class Meta:
                    permissions = [
                        ("custom_permission", "Permission description"),
                    ]

            class MyViewSet(viewsets.ModelViewSet):
                queryset = MyModel.objects.all()
                serializer_class = MySerializer
                permission_classes = [DjangoModelPermission]
                required_permissions = ['app.custom_permission']

    You can also add it directly to the settings.py of your Django project.
    """

    perms_map = {
        "GET":      ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS":  [],
        "HEAD":     [],
        "POST":     ["%(app_label)s.add_%(model_name)s"],
        "PUT":      ["%(app_label)s.change_%(model_name)s"],
        "PATCH":    ["%(app_label)s.change_%(model_name)s"],
        "DELETE":   ["%(app_label)s.delete_%(model_name)s"],
    }

    def has_permission(self, request, view):
        # Check user authentication
        if not request.user or not request.user.is_authenticated:
            return False
        
        any_perms = getattr(view, 'required_any_permissions', None)
        if any_perms is not None:
            return any(request.user.has_perm(p) for p in any_perms)

        # When required_permissions, check the custom permissions
        custom_perms = getattr(view, 'required_permissions', None)
        if custom_perms is not None:
            return all(request.user.has_perm(perm) for perm in custom_perms)

        # If not, use the CRUD permissions (perms_map)
        return super().has_permission(request, view)

