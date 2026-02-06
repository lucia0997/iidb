from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from rest_framework.fields import empty
from ..models import (
    Technology,
    TRL,
    TechnologyTRL,
    PhysicalTechnologyCluster,
    DigitalTechnologyCluster,
    ProductRoadmap,
    TechnologyRoadmap,
    FoMType,
    TargetedProgramme,
    ACApplication,
)



class TRLSerializer(serializers.ModelSerializer):
    trl_number = serializers.IntegerField(label=_("TRL Number"), required=True)
    trl_year = serializers.IntegerField(
        label=_("TRL Year"), required=False, allow_null=True
    )
    trl_cost = serializers.DecimalField(
        label=_("TRL Cost"),
        max_digits=14,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = TRL
        fields = ["id", "trl_number", "trl_year", "trl_cost"]


class TechnologySerializer(serializers.ModelSerializer):
    physical_technology_cluster = serializers.PrimaryKeyRelatedField(
        queryset=PhysicalTechnologyCluster.objects.all(),
        label=_("Physical Technology Cluster"),
        allow_null=True,
        required=False,
    )
    digital_technology_cluster = serializers.PrimaryKeyRelatedField(
        queryset=DigitalTechnologyCluster.objects.all(),
        label=_("Digital Technology Cluster"),
        allow_null=True,
        required=False,
    )
    product_roadmap = serializers.PrimaryKeyRelatedField(
        queryset=ProductRoadmap.objects.all(),
        label=_("Product Roadmap"),
        allow_null=True,
        required=False,
    )
    technology_roadmap = serializers.PrimaryKeyRelatedField(
        queryset=TechnologyRoadmap.objects.all(),
        label=_("Technology Roadmap"),
        allow_null=True,
        required=False,
    )
    technology_name = serializers.CharField(label=_("Technology Name"), allow_blank=False, allow_null=False, required=True)
    technology_description = serializers.CharField(label=_("Technology Description"), allow_blank=True, allow_null=True, required=False)
    dependencies = serializers.ListField(child=serializers.CharField(), label=_("Dependencies"), help_text=_("Same list of values as Technology Cluster"), required=False, allow_empty=True)
    targeted_programmes = serializers.PrimaryKeyRelatedField(
        queryset=TargetedProgramme.objects.all(),
        many=True,
        label=_("Targeted Programmes"),
        required=False,
        allow_empty=True,
    )
    current_trl = serializers.IntegerField(
        label=_("Current TRL (1-9)"),
        required=True,
        allow_null=False,
        min_value=1,
        max_value=9,
    )
    # Para escritura aceptamos IDs (campo write-only); para lectura devolvemos objetos TRL completos.
    trls = TRLSerializer(many=True, label=_("TRLs"), read_only=True)
    trls_ids = serializers.PrimaryKeyRelatedField(
        source="trls",
        queryset=TRL.objects.all(),
        many=True,
        label=_("TRLs"),
        required=False,
        allow_empty=True,
        write_only=True,
    )
    fom_type = serializers.PrimaryKeyRelatedField(
        queryset=FoMType.objects.all(),
        many=True,
        label=_("FoM Type"),
        required=False,
        allow_empty=True,
    )
    fom_value_percent = serializers.DecimalField(label=_("FoM Value (%)"), max_digits=5, decimal_places=2, required=False, allow_null=True)
    ac_application = serializers.PrimaryKeyRelatedField(
        queryset=ACApplication.objects.all(),
        label=_("A/C Application"),
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Technology
        fields = [
            "id",
            "physical_technology_cluster",
            "digital_technology_cluster",
            "product_roadmap",
            "technology_roadmap",
            "technology_name",
            "technology_description",
            "current_trl",
            "trls",
            "trls_ids",
            "dependencies",
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

    def validate_dependencies(self, value):
        return self._validate_string_list(value, "Dependencies")

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
        # Clear existing TRLs
        instance.trls.clear()
        # Create TechnologyTRL entries explicitly to ensure trl_number is set
        for trl in trls:
            TechnologyTRL.objects.create(
                technology=instance,
                trl=trl,
                trl_number=trl.trl_number
            )

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

class TechnologyWithTRLsSerializer(TechnologySerializer):
    """
    Serializer especial para ?trls=true.
    Devuelve:
      - Todas las columnas de Technology
      - 18 columnas adicionales: trl1_year, trl1_cost, ..., trl9_year, trl9_cost
    Rellenando a partir de los TRLs relacionados (Technology.trls).
    """

    class Meta(TechnologySerializer.Meta):
        # Usamos exactamente los mismos campos base que TechnologySerializer.
        # Las columnas TRL (trlX_year / trlX_cost) se añaden solo en la representación
        # para no romper el mapeo automático de ModelSerializer.
        fields = TechnologySerializer.Meta.fields

    def to_representation(self, instance: Technology):
        """
        Partimos de la representación normal y añadimos las columnas
        trlX_year / trlX_cost calculadas en un solo sitio.
        También convertimos los IDs de ForeignKey/ManyToManyField a nombres.
        """
        data = super().to_representation(instance)

        # Convertir ForeignKeys a nombres
        if 'physical_technology_cluster' in data and data['physical_technology_cluster']:
            data['physical_technology_cluster'] = instance.physical_technology_cluster.name if instance.physical_technology_cluster else None
        if 'digital_technology_cluster' in data and data['digital_technology_cluster']:
            data['digital_technology_cluster'] = instance.digital_technology_cluster.name if instance.digital_technology_cluster else None
        if 'product_roadmap' in data and data['product_roadmap']:
            data['product_roadmap'] = instance.product_roadmap.name if instance.product_roadmap else None
        if 'technology_roadmap' in data and data['technology_roadmap']:
            data['technology_roadmap'] = instance.technology_roadmap.name if instance.technology_roadmap else None
        if 'ac_application' in data and data['ac_application']:
            data['ac_application'] = instance.ac_application.name if instance.ac_application else None
        
        # Convertir ManyToManyFields a listas de nombres
        if 'fom_type' in data:
            data['fom_type'] = [fom_type.name for fom_type in instance.fom_type.all()] if instance.fom_type.exists() else []
        if 'targeted_programmes' in data:
            data['targeted_programmes'] = [programme.name for programme in instance.targeted_programmes.all()] if instance.targeted_programmes.exists() else []

        # Construimos un diccionario {trl_number: trl} una sola vez
        trls_by_number = {trl.trl_number: trl for trl in instance.trls.all()}

        for number in range(1, 10):
            trl = trls_by_number.get(number)
            data[f"trl{number}_year"] = trl.trl_year if trl else None
            data[f"trl{number}_cost"] = trl.trl_cost if trl else None

        return data

class TechnologyRowSerializer(serializers.ModelSerializer):
    # Campos personalizados para devolver nombres en lugar de IDs
    physical_technology_cluster = serializers.SerializerMethodField()
    digital_technology_cluster = serializers.SerializerMethodField()
    product_roadmap = serializers.SerializerMethodField()
    technology_roadmap = serializers.SerializerMethodField()
    ac_application = serializers.SerializerMethodField()
    fom_type = serializers.SerializerMethodField()
    targeted_programmes = serializers.SerializerMethodField()
    
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
    
    def get_physical_technology_cluster(self, obj):
        return obj.physical_technology_cluster.name if obj.physical_technology_cluster else None
    
    def get_digital_technology_cluster(self, obj):
        return obj.digital_technology_cluster.name if obj.digital_technology_cluster else None
    
    def get_product_roadmap(self, obj):
        return obj.product_roadmap.name if obj.product_roadmap else None
    
    def get_technology_roadmap(self, obj):
        return obj.technology_roadmap.name if obj.technology_roadmap else None
    
    def get_ac_application(self, obj):
        return obj.ac_application.name if obj.ac_application else None
    
    def get_fom_type(self, obj):
        return [fom_type.name for fom_type in obj.fom_type.all()] if obj.fom_type.exists() else []
    
    def get_targeted_programmes(self, obj):
        return [programme.name for programme in obj.targeted_programmes.all()] if obj.targeted_programmes.exists() else []

class TRLSerializer(serializers.ModelSerializer):
    trl_number = serializers.IntegerField(label=_("TRL Number"), required=True)
    trl_year = serializers.IntegerField(label=_("TRL Year"), required=False, allow_null=True)
    trl_cost = serializers.DecimalField(label=_("TRL Cost"), max_digits=14, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = TRL
        fields = ["id", "trl_number", "trl_year", "trl_cost"]