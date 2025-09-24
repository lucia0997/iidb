from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "full_name", "email", "groups",)

    def get_groups(self, obj):
        return ", ".join([group.name for group in obj.groups.all()])

class UserUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True)
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True)

    class Meta:
        model = User
        fields = ("username", "groups",)