from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from apps.authorization.serializers import GroupSerializer

User = get_user_model()


class UserListSerializer(serializers.ModelSerializer):
    group_names = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "full_name", "email", "is_active", "group_names",)

    def get_group_names(self, obj):
        return list(obj.groups.values_list("name", flat=True))
    
class UserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    groups = GroupSerializer(many=True, read_only=True)
    group_ids = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True,
        write_only=True,
        required=False,
        help_text="List of group IDs to assign"
    )
    
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "is_active",
            "groups",       # read-only
            "group_ids",    # write-only
        )
        read_only_fields = ("id", "full_name", "username")
        
    def update(self, instance, validated_data):
        group_ids = validated_data.pop("group_ids", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if group_ids is not None:
            instance.groups.set(group_ids)
        return instance
        