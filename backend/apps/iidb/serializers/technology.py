from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from rest_framework.fields import empty
from ..models import Technology, TRL


class TechnologySerializer(serializers.ModelSerializer):
    technology_cluster = serializers.CharField(label=_("Technology Cluster"),allow_blank=True,allow_null=True,required=False)
    coc_expert_name = serializers.CharField(label=_("CoC Expert Name"), allow_blank=True, allow_null=True, required=False)
    product_domains = serializers.CharField(label=_("Product Domains"), allow_blank=True, allow_null=True, required=False)
    technology_domains = serializers.CharField(label=_("Technology Domains"), allow_blank=True, allow_null=True, required=False)
    technology_name = serializers.CharField(label=_("Technology Name"), allow_blank=False, allow_null=False, required=True)
    technology_description = serializers.CharField(label=_("Technology Description"), allow_blank=True, allow_null=True, required=False)
    tdm_names = serializers.ListField(child=serializers.CharField(), label=_("TDM Name"), help_text=_("List of TMD names"), required=False, allow_empty=True)
    tech_cluster_dependencies = serializers.ListField(child=serializers.CharField(), label=_("Tech. Cluster Dependencies"), help_text=_("Same list of values as Technology Cluster"), required=False, allow_empty=True)
    targeted_programmes = serializers.ListField(child=serializers.CharField(), label=_("Targeted Programmes"), help_text=_("List of targeted programmes (same taxonomy as PlantProgrammes.program)"), required=False, allow_empty=True)
    current_trl = serializers.IntegerField(label=_("Current TRL (1-9)"), required=False, allow_null=True, min_value=1, max_value=9)
    trls = serializers.PrimaryKeyRelatedField(queryset=TRL.objects.all(), many=True, label=_("TRLs"), required=False, allow_empty=True)
    fom_type = serializers.CharField(label=_("FoM Type"), allow_blank=True, allow_null=True, required=False)
    fom_value_percent = serializers.DecimalField(label=_("FoM Value (%)"), max_digits=5, decimal_places=2, required=False, allow_null=True)
    ac_application = serializers.CharField(label=_("A/C Application"), allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = Technology
        fields = [
            "id",
            "technology_cluster",
            "coc_expert_name",
            "product_domains",
            "technology_domains",
            "tdm_names",
            "technology_name",
            "technology_description",
            "current_trl",
            "trls",
            "tech_cluster_dependencies",
            "fom_type",
            "fom_value_percent",
            "targeted_programmes",
            "ac_application",
        ]

    def _validate_string_list(self, value, field_name):
        if value is None:
            return []
        if not isinstance(value, list) or not all(isinstance(x, (str, type(None))) for x in value):
            raise serializers.ValidationError(
                _(f"{field_name} must be a list of strings"))

        return [x for x in value if x not in (None, "")]

    def validate_tdm_names(self, value):
        return self._validate_string_list(value, "TDM Name")

    def validate_tech_cluster_dependencies(self, value):
        return self._validate_string_list(value, "Tech. Cluster Dependencies")

    def validate_targeted_programmes(self, value):
        return self._validate_string_list(value, "Targeted Programmes")

    def validate_trls(self, value):
        if not value:
            return []
        numbers = [trl.trl_number for trl in value]
        if len(numbers) != len(set(numbers)):
            raise serializers.ValidationError(_("Each TRL number can only be linked once per technology."))
        return value

    def _set_trls(self, instance, trls):
        if trls is None:
            return
        # Clear and set in one go; through model enforces uniqueness by trl_number
        instance.trls.set(trls)

    def create(self, validated_data):
        trls = validated_data.pop("trls", [])
        instance = super().create(validated_data)
        self._set_trls(instance, trls)
        return instance

    def update(self, instance, validated_data):
        trls = validated_data.pop("trls", None)
        instance = super().update(instance, validated_data)
        if trls is not None:
            self._set_trls(instance, trls)
        return instance


class TechnologyRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        only_fields = kwargs.pop("only_fields", None)
        super().__init__(*args, **kwargs)

        if only_fields:
            keep = {"id", *only_fields}
            for f in list(self.fields.keys()):
                if f not in keep:
                    self.fields.pop(f)

class TRLSerializer(serializers.ModelSerializer):
    trl_number = serializers.IntegerField(label=_("TRL Number"), required=True)
    trl_year = serializers.IntegerField(label=_("TRL Year"), required=False, allow_null=True)
    trl_cost = serializers.DecimalField(label=_("TRL Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = TRL
        fields = ["id", "trl_number", "trl_year", "trl_cost"]