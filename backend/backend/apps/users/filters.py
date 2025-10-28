from django_filters import FilterSet, CharFilter
from django.contrib.auth import get_user_model

User = get_user_model()

class UserFilter(FilterSet):
    username = CharFilter(field_name="username", lookup_expr="icontains")
    full_name = CharFilter(field_name="full_name", lookup_expr="icontains")
    email = CharFilter(field_name="email", lookup_expr="icontains")
    groups = CharFilter(field_name="groups__name", lookup_expr="icontains")

    class Meta:
        model = User
        fields = (
            "username",
            "full_name",
            "email",
            "groups",
        )