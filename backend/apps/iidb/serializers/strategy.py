from rest_framework import serializers
from ..models import Strategy
from django.utils.translation import gettext_lazy as _


class StrategySerializer(serializers.ModelSerializer):
    cosmos_dvs = serializers.CharField(label=_("Cosmos DVSs"), allow_blank=True, allow_null=True, required=False)
    cosmos_dvs_resp_name = serializers.CharField(label=_("Cosmos DVS Responsible Name"), allow_blank=True, allow_null=True, required=False)
    coc_clusters = serializers.CharField(label=_("CoC Clusters"), allow_blank=True, allow_null=True, required=False)
    coc_expertise = serializers.CharField(label=_("CoC Expertise"), allow_blank=True, allow_null=True, required=False)
    coc_expert_name = serializers.CharField(label=_("CoC Expert Name"), allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = Strategy
        fields = ["id", "cosmos_dvs", "cosmos_dvs_resp_name", "coc_clusters", "coc_expertise", "coc_expert_name"]
    
    
class StrategyRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
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
