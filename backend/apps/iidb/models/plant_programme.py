from django.db import models
from django.utils.translation import gettext_lazy as _
from .technology import Technology

class PlantProgramme(models.Model):
    technology_name = models.ForeignKey(Technology, on_delete=models.CASCADE, to_field='technology_name', verbose_name=_("Technology Name"))
    program = models.JSONField(default=list, verbose_name=_("Program"), help_text=_("List of technology-related programs"))
    business = models.CharField(max_length=255, verbose_name=_("Business"))
    site = models.CharField(max_length=255, verbose_name=_("Site"))
    
    class Meta:
        db_table = "plants_programmes"
        verbose_name = _("Plant Programme")
        verbose_name_plural = _("Plants Programmes")
        
    def __str__(self):
        return f"{self.technology_name} - {self.site}"
