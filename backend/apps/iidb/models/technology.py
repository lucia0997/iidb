from django.db import models
from django.utils.translation import gettext_lazy as _

class TRLLevel(models.IntegerChoices):
    TRL1 = 1, "TRL 1",
    TRL2 = 2, "TRL 2",
    TRL3 = 3, "TRL 3",
    TRL4 = 4, "TRL 4",
    TRL5 = 5, "TRL 5",
    TRL6 = 6, "TRL 6",
    TRL7 = 7, "TRL 7",
    TRL8 = 8, "TRL 8",
    TRL9 = 9, "TRL 9"
    
class Technology(models.Model):
    technology_cluster = models.CharField(
        max_length=255,
        verbose_name=_("Technology Cluster"),
    )
    
    coc_expert_name = models.CharField(
        max_length=255,
        verbose_name=_("CoC Expert Name"),
        blank=True,
    )
    
    # De momento texto plano, pendiente confirmar si es una lista para migrar a JSONField(list)
    product_domains = models.CharField(
        max_length=255,
        verbose_name=_("Product Domains"),
        blank=True
    )
    
    technology_domains = models.CharField(
        max_length=255,
        verbose_name=_("Technology Domains"),
        blank=True,
    )
    
    tdm_names = models.JSONField(
        default=list,
        verbose_name=_("TDM Name"),
        help_text=_("List of TMD names"),
        blank=True
    )
    
    technology_name = models.CharField(
        max_length=255,
        verbose_name=_("Technology Name"),
    )
    
    technology_description = models.TextField(
        verbose_name=_("Technology Description"),
        blank=True
    )
    
    current_trl = models.PositiveSmallIntegerField(
        verbose_name=_("Current TRL (1-9)"),
        choices=TRLLevel.choices,
        null=True,
        blank=True,
    )
    
    trl1_year = models.PositiveSmallIntegerField(_("TRL1 Year"), null=True, blank=True)
    trl2_year = models.PositiveSmallIntegerField(_("TRL2 Year"), null=True, blank=True)
    trl3_year = models.PositiveSmallIntegerField(_("TRL3 Year"), null=True, blank=True)
    trl4_year = models.PositiveSmallIntegerField(_("TRL4 Year"), null=True, blank=True)
    trl5_year = models.PositiveSmallIntegerField(_("TRL5 Year"), null=True, blank=True)
    trl6_year = models.PositiveSmallIntegerField(_("TRL6 Year"), null=True, blank=True)
    trl7_year = models.PositiveSmallIntegerField(_("TRL7 Year"), null=True, blank=True)
    trl8_year = models.PositiveSmallIntegerField(_("TRL8 Year"), null=True, blank=True)
    trl9_year = models.PositiveSmallIntegerField(_("TRL9 Year"), null=True, blank=True)
    
    trl1_cost = models.DecimalField(_("TRL1 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    trl2_cost = models.DecimalField(_("TRL2 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    trl3_cost = models.DecimalField(_("TRL3 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    trl4_cost = models.DecimalField(_("TRL4 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    trl5_cost = models.DecimalField(_("TRL5 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    trl6_cost = models.DecimalField(_("TRL6 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    trl7_cost = models.DecimalField(_("TRL7 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    trl8_cost = models.DecimalField(_("TRL8 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    trl9_cost = models.DecimalField(_("TRL9 Cost"), max_digits=14, decimal_places=2, null=True, blank=True)
    
    tech_cluster_dependencies = models.JSONField(
        default=list,
        verbose_name=_("Tech. Cluster Dependencies"),
        help_text=_("Same list of values as Technology Cluster"),
        blank=True
    )
    
    fom_type = models.CharField(
        max_length=100,
        verbose_name=_("FoM Type"),
        blank=True
    )
    
    fom_value_percent = models.DecimalField(
        verbose_name=_("FoM Value (%)"),
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    targeted_programmes = models.JSONField(
        default=list,
        verbose_name=_("Targeted Programmes"),
        help_text=_("List of targeted programmes (same taxonomy as PlantProgrammes.program)"),
        blank=True
    )
    
    ac_application = models.CharField(
        max_length=255,
        verbose_name=_("A/C Application"),
        blank=True
    )
    
    class Meta:
        db_table = "technologies"
        verbose_name = _("Technology")
        verbose_name_plural = _("Technologies")
        
    def __str__(self):
        return self.technology_name