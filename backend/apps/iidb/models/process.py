from django.db import models
from django.utils.translation import gettext_lazy as _

class Process(models.Model):
    group_processes = models.CharField(max_length=255, verbose_name=_("Group Processes"))
    subgroup_processes = models.CharField(max_length=255, verbose_name=_("Sub-Group Processes"))
    process_name = models.CharField(max_length=255, verbose_name=_("Process Name"))
    process_resp_name = models.CharField(max_length=255, verbose_name=_("Process Responsible Name"))
    technology_name = models.CharField(max_length=255, verbose_name=_("Technology Name"))
    
    class Meta:
        db_table = "processes"
        verbose_name = _("Process")
        verbose_name_plural = _("Processes")
        
    def __str__(self):
        return f"{self.process_name}"
