from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import Group

class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name")