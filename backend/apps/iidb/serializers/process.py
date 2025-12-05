from rest_framework import serializers
from ..models import Process
from django.utils.translation import gettext_lazy as _


class ProcessSerializer(serializers.ModelSerializer):
    group_processes = serializers.CharField(label=_("Group Processes"), allow_blank=True, allow_null=True, required=False)
    subgroup_processes = serializers.CharField(label=_("Sub-Group Processes"), allow_blank=True, allow_null=True, required=False)
    process_name = serializers.CharField(label=_("Process Name"), allow_blank=True, allow_null=True, required=False)
    process_resp_name = serializers.CharField(label=_("Process Responsible Name"), allow_blank=True, allow_null=True, required=False)
    technology_name = serializers.CharField(label=_("Technology Name"), allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = Process
        fields = ["id", "group_processes", "subgroup_processes", "process_name", "process_resp_name", "technology_name"]
    
    
class ProcessRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Process
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
