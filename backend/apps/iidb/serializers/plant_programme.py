from rest_framework import serializers
from ..models import PlantProgramme
from django.utils.translation import gettext_lazy as _


class PlantProgrammeSerializer(serializers.ModelSerializer):
    technology_name = serializers.CharField(label=_("Technology Name"))
    program = serializers.ListField(
        child=serializers.CharField(),
        label=_("Program"),
        help_text=_("List of technology-related programs")
    )
    business = serializers.CharField(label=_("Business"))
    site = serializers.CharField(label=_("Site"))

    class Meta:
        model = PlantProgramme
        fields = ["id", "technology_name", "program", "business", "site"]

    def validate_program(self, value):
        if not isinstance(value, list) or not all(isinstance(x, str) for x in value):
            raise serializers.ValidationError(
                _("Program must be a list of strings."))
        return value
