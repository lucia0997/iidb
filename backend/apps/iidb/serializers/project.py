from rest_framework import serializers
from ..models import Project
from django.utils.translation import gettext_lazy as _


class ProjectSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(label=_("Project Name"), allow_blank=True, allow_null=True, required=False)
    project_id = serializers.CharField(label=_("Project ID"), allow_blank=True, allow_null=True, required=False)
    project_name = serializers.CharField(label=_("Project Name"), allow_blank=True, allow_null=True, required=False)
    status = serializers.CharField(label=_("Status"), allow_blank=True, allow_null=True, required=False)
    project_description = serializers.CharField(label=_("Project Description"), allow_blank=True, allow_null=True, required=False)
    project_benefits = serializers.CharField(label=_("Project Benefits"), allow_blank=True, allow_null=True, required=False)
    ads_group = serializers.CharField(label=_("Airbus Group Division"), allow_blank=True, allow_null=True, required=False)
    programmes = serializers.ListField(
        child=serializers.CharField(),
        label=_("Programmes - Plant"),
        help_text=_("List of programmes - plant"),
        required=False,
        allow_empty=True,
    )
    synergies = serializers.CharField(label=_("Synergies Project Name AG"), allow_blank=True, allow_null=True, required=False)
    project_leader = serializers.CharField(label=_("Project Leader"), allow_blank=True, allow_null=True, required=False)
    other_team_members = serializers.CharField(label=_("Other Team Members"), allow_blank=True, allow_null=True, required=False)
    project_start_date = serializers.DateField(label=_("Project Start Date"), allow_null=True, required=False)
    project_end_date = serializers.DateField(label=_("Project End Date"), allow_null=True, required=False)
    project_total_cost = serializers.DecimalField(label=_("Project Total Cost"), allow_null=True, required=False, max_digits=14, decimal_places=2)
    project_funding_call = serializers.CharField(label=_("Project Funding Call Name"), allow_blank=True, allow_null=True, required=False)
    project_maturity = serializers.CharField(label=_("Project Maturity"), allow_blank=True, allow_null=True, required=False)
    project_running_status = serializers.CharField(label=_("Project Running Status"), allow_blank=True, allow_null=True, required=False)
    
    class Meta:
        model = Project
        fields = ["id", "project_id", "project_name", "status", "project_description", "project_benefits", "ads_group", "programmes", "synergies", "project_leader", "other_team_members", "project_start_date", "project_end_date", "project_total_cost", "project_funding_call", "project_maturity", "project_running_status"]
    
    def validate_programmes(self, value):
        if value is None:
            return []
        if not isinstance(value, list) or not all(isinstance(x, (str, type(None))) for x in value):
            raise serializers.ValidationError(_("Programmes must be a list of strings"))
    
    
class ProjectRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
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
