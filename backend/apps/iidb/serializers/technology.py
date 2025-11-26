from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from rest_framework.fields import empty
from ..models import Technology


class TechnologySerializer(serializers.ModelSerializer):

    technology_cluster = serializers.CharField(
        label=_("Technology Cluster"),
        allow_blank=True,
        allow_null=True,
        required=False,
    )

    coc_export_name = serializers.CharField(
        label=_("CoC Expert Name"),
        allow_blank=True,
        allow_null=True,
        required=False,
    )

    product_domains = serializers.CharField(
        label=_("Product Domains"),
        allow_blank=True,
        allow_null=True,
        required=False,
    )

    technology_domains = serializers.CharField(
        verbose_name=_("Technology Domains"),
        allow_blank=True,
        allow_null=True,
        required=False,
    )

    technology_name = serializers.CharField(
        label=_("Technology Name"),
        allow_blank=False,
        allow_null=False,
        required=True,
    )

    technology_description = serializers.CharField(
        label=_("Technology Description"),
        allow_blank=True,
        allow_null=True,
        required=False,
    )

    tmd_names = serializers.ListField(
        child=serializers.CharField,
        label=_("TDM Name"),
        help_text=_("List of TMD names"),
        required=False,
        allow_empty=True,
    )

    tech_cluster_dependencies = serializers.ListField(
        child=serializers.CharField,
        label=_("Tech. Cluster Dependencies"),
        help_text=_("Same list of values as Technology Cluster"),
        required=False,
        allow_empty=True
    )

    targeted_programmes = serializers.ListField(
        child=serializers.CharField,
        label=_("Targeted Programmes"),
        help_text=_(
            "List of targeted programmes (same taxonomy as PlantProgrammes.program)"),
        required=False,
        allow_empty=True,
    )

    current_trl = serializers.IntegerField(
        label=_("Current TRL (1-9)"),
        required=False,
        allow_null=True,
        min_value=1,
        max_value=9
    )

    trl1_year = serializers.IntegerField(
        label=_("TRL1 Year"), required=False, allow_null=True)
    trl2_year = serializers.IntegerField(
        label=_("TRL2 Year"), required=False, allow_null=True)
    trl3_year = serializers.IntegerField(
        label=_("TRL3 Year"), required=False, allow_null=True)
    trl4_year = serializers.IntegerField(
        label=_("TRL4 Year"), required=False, allow_null=True)
    trl5_year = serializers.IntegerField(
        label=_("TRL5 Year"), required=False, allow_null=True)
    trl6_year = serializers.IntegerField(
        label=_("TRL6 Year"), required=False, allow_null=True)
    trl7_year = serializers.IntegerField(
        label=_("TRL7 Year"), required=False, allow_null=True)
    trl8_year = serializers.IntegerField(
        label=_("TRL8 Year"), required=False, allow_null=True)
    trl9_year = serializers.IntegerField(
        label=_("TRL9 Year"), required=False, allow_null=True)

    trl1_cost = serializers.DecimalField(label=_(
        "TRL1 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)
    trl2_cost = serializers.DecimalField(label=_(
        "TRL2 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)
    trl3_cost = serializers.DecimalField(label=_(
        "TRL3 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)
    trl4_cost = serializers.DecimalField(label=_(
        "TRL4 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)
    trl5_cost = serializers.DecimalField(label=_(
        "TRL5 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)
    trl6_cost = serializers.DecimalField(label=_(
        "TRL6 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)
    trl7_cost = serializers.DecimalField(label=_(
        "TRL7 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)
    trl8_cost = serializers.DecimalField(label=_(
        "TRL8 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)
    trl9_cost = serializers.DecimalField(label=_(
        "TRL9 Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True,)

    fom_type = serializers.CharField(
        label=_("FoM Type"),
        allow_blank=True,
        allow_null=True,
        required=False,
    )

    fom_value_percent = serializers.DecimalField(
        label=_("FoM Value (%)"),
        max_digits=5,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    ac_application = serializers.CharField(
        label=_("A/C Application"),
        allow_blank=True,
        allow_null=True,
        required=False,
    )

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
            "trl1_year",
            "trl2_year",
            "trl3_year",
            "trl4_year",
            "trl5_year",
            "trl6_year",
            "trl7_year",
            "trl8_year",
            "trl9_year",
            "trl1_cost",
            "trl2_cost",
            "trl3_cost",
            "trl4_cost",
            "trl5_cost",
            "trl6_cost",
            "trl7_cost",
            "trl8_cost",
            "trl9_cost",
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
