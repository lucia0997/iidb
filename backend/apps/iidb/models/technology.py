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

class TRL(models.Model):
    trl_number = models.PositiveSmallIntegerField(
        choices=TRLLevel.choices,
        verbose_name=_("TRL Number"),
        null=False,
        blank=False
    )
    trl_year = models.PositiveSmallIntegerField(verbose_name=_("TRL Year"), null=True, blank=True)
    trl_cost = models.DecimalField(max_digits=14, decimal_places=2, verbose_name=_("TRL Cost"), null=True, blank=True)
    
    class Meta:
        db_table = "trls"
        verbose_name = _("TRL")
        verbose_name_plural = _("TRLs")
    
    def __str__(self):
        return f"TRL {self.trl_number}"
    
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
        unique=True,
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

    trl = models.ForeignKey(TRL, on_delete=models.CASCADE, verbose_name=_("TRL"), null=True, blank=True)

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