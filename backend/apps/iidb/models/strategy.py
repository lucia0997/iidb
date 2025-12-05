from django.db import models
from django.utils.translation import gettext_lazy as _

class Strategy(models.Model):
    cosmos_dvs = models.CharField(max_length=255, verbose_name=_("Cosmos DVSs"))
    cosmos_dvs_resp_name = models.CharField(max_length=255, verbose_name=_("Cosmos DVS Responsible Name"))
    coc_clusters = models.CharField(max_length=255, verbose_name=_("CoC Clusters"))
    coc_expertise = models.CharField(max_length=255, verbose_name=_("CoC Expertise"))
    coc_expert_name = models.CharField(max_length=255, verbose_name=_("CoC Expert Name"))
    
    class Meta:
        db_table = "strategies"
        verbose_name = _("Strategy")
        verbose_name_plural = _("Strategies")
        
    def __str__(self):
        return f"{self.cosmos_dvs} - {self.cosmos_dvs_resp_name}"
