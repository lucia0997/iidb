from rest_framework import serializers
from ..models import PlantProgramme, Technology
from django.utils.translation import gettext_lazy as _


class PlantProgrammeSerializer(serializers.ModelSerializer):
    technology_name = serializers.SlugRelatedField(queryset=Technology.objects.all(), slug_field='technology_name', label=_("Technology Name"), allow_null=True, required=False)
    program = serializers.ListField(child=serializers.CharField(), label=_("Program"), help_text=_("List of technology-related programs"), required=False, allow_empty=True)
    business = serializers.CharField(label=_("Business"), allow_blank=True, allow_null=True, required=False)
    site = serializers.CharField(label=_("Site"), allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = PlantProgramme
        fields = ["id", "technology_name", "program", "business", "site"]

    def validate_program(self, value):
        if value is None:
            return []
        if not isinstance(value, list) or not all(isinstance(x, (str, type(None))) for x in value):
            raise serializers.ValidationError(_("Program must be a list of strings"))
    
    
class PlantProgrammeRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantProgramme
        fields = "__all__"
        
    def __init__(self, *args, **kwargs):
        # dynamic fields received from the view
        only_fields = kwargs.pop("only_fields", None)
        super().__init__(*args, **kwargs)
            
        if only_fields:
            keep = {"id", *only_fields}
            for f in list(self.fields.keys()):
                if f not in keep:
                    self.fields.pop(f)
