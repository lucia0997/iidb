from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .ldap_service import ldap_service

User = get_user_model()

class UserCreateSerializer(serializers.ModelSerializer):
    """
    POST body: 
    {
        "username": "#####",
        "groups": ["Group1",...] or "group" : "Group1"

    }
    """
    username = serializers.CharField(max_length=15)
    group = serializers.CharField(required=False, write_only=True, max_length=50)
    groups = serializers.ListField(
        child = serializers.CharField(max_length=50),
        write_only = True,
        required = False,
    )

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "group", "groups")
        read_only_fields = ("id", "email", "first_name", "last_name")

    # Group list or string manager
    def validate_group(self, group: str) -> list[Group]:
        try:
            return [Group.objects.get(name=group.strip())]
        except Group.DoesNotExist:
            raise serializers.ValidationError(f"Unkown group: {group}")
        
    def validate_groups(self, groups:list[str]) -> list[Group]:
        """
        Custom group validator to allow multiple group entries
        """
        groups_set = {g.strip() for g in groups if g.strip()}
        if not groups_set:
            raise serializers.ValidationError("At least one group must be provided.")
        
        groups_qs = Group.objects.filter(name__in = groups_set)
        groups_nf = groups_set - set(groups_qs.values_list('name', flat=True))
        if groups_nf:
            raise serializers.ValidationError(f"Group(s) not found: {', '.join(groups_nf)}")
        return list(groups_qs)

    # Username LDAP validation
    def validate_username(self, username: str) -> str:
        if not (username.isalnum() and username.upper() == username):
            raise serializers.ValidationError("Username must be uppercase and contain only letters and digits.")

        # DB check
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        
        # LDAP check
        if not ldap_service.user_exists(username = username):
            raise serializers.ValidationError("User does not exist in Airbus Active Directory.")
        
        return username
    
    # Object level validation (group field selection)
    def validate(self, attrs):
        group = attrs.get("group")
        groups = attrs.get("groups")

        if group and groups:
            raise serializers.ValidationError("Provide either 'group' or 'groups', not both fields.")
        if not group and not groups:
            raise serializers.ValidationError("Group field is mandatory")
        
        attrs["groups"] = group or groups
        attrs.pop("group", None)
        return attrs
    
    @transaction.atomic()
    def create(self, validated_data):

        groups = validated_data["groups"]
        username = validated_data["username"]

        attrs = ldap_service.fetch_user_attributes(
            username=username, 
            attributes=["givenName", "sn", "mail"]
        ) or {}

        user = User.objects.create(
            username        = username,
            email           = attrs.get("mail", [""])[0],
            first_name      = attrs.get("givenName", [""])[0],
            last_name       = attrs.get("sn", [""])[0],
            is_active       = True, 
            **validated_data
        )

        user.set_unusable_password()
        user.groups.set(groups)
        return user


class MeSerializer(serializers.ModelSerializer):
    """
    Return the authenticated user details, including groups and permissions
    """
    groups      = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "full_name", "groups", "permissions")

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def get_groups(self, obj):
        return list(obj.groups.values_list('name', flat=True))
    
    def get_permissions(self, obj):
        return list(obj.get_all_permissions())
    
class LoginSerializer(TokenObtainPairSerializer):
    """
    Return all the login info: JWT tokens and user information
    """
    user = MeSerializer(read_only=True)

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = MeSerializer(self.user, context=self.context).data
        return data
    
    class Meta:
        fields = ("user", "access", "refresh")
        read_only_fields = fields