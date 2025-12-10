from django.db import models
from django.utils.translation import gettext_lazy as _

class Project(models.Model):
    project_id = models.CharField(max_length=255, verbose_name=_("Project ID"))
    project_name = models.CharField(max_length=255, verbose_name=_("Project Name"))
    status = models.CharField(max_length=255, verbose_name=_("Status"))
    project_description = models.CharField(max_length=255, verbose_name=_("Project Description"))
    project_benefits = models.CharField(max_length=255, verbose_name=_("Project Benefits"))
    ads_group = models.CharField(max_length=255, verbose_name=_("Airbus Group Division"))
    programmes = models.JSONField(default=list, verbose_name=_("Programmes"), help_text=_("Programmes - Plant"))
    synergies = models.CharField(max_length=255, verbose_name=_("Synergies Project Name AG"))
    project_leader = models.CharField(max_length=255, verbose_name=_("Project Leader"))
    other_team_members = models.CharField(max_length=255, verbose_name=_("Other Team Members"))
    project_start_date = models.DateField(verbose_name=_("Project Start Date"), null=True, blank=True)
    project_end_date = models.DateField(verbose_name=_("Project End Date"), null=True, blank=True)
    project_total_cost = models.DecimalField(verbose_name=_("Project Total Cost"), null=True, blank=True, max_digits=14, decimal_places=2)
    project_funding_call = models.CharField(max_length=255, verbose_name=_("Project Funding Call Name"))
    project_maturity = models.CharField(max_length=255, verbose_name=_("Project Maturity"))
    project_running_status = models.CharField(max_length=255, verbose_name=_("Project Running Status"))
    
    class Meta:
        db_table = "projects"
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")
        
    def __str__(self):
        return f"{self.project_id} - {self.project_name}"
