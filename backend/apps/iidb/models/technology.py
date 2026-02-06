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
    trl_number = models.PositiveSmallIntegerField(choices=TRLLevel.choices, verbose_name=_("TRL Number"), null=False, blank=False)
    trl_year = models.PositiveSmallIntegerField(verbose_name=_("TRL Year"), null=True, blank=True)
    trl_cost = models.DecimalField(max_digits=14, decimal_places=2, verbose_name=_("TRL Cost"), null=True, blank=True)

    class Meta:
        db_table = "trls"
        verbose_name = _("TRL")
        verbose_name_plural = _("TRLs")

    def __str__(self):
        return f"TRL {self.trl_number}"


class PhysicalTechnologyCluster(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name=_("Name"))

    class Meta:
        db_table = "physical_technology_clusters"
        verbose_name = _("Physical Technology Cluster")
        verbose_name_plural = _("Physical Technology Clusters")

    def __str__(self):
        return self.name


class DigitalTechnologyCluster(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name=_("Name"))

    class Meta:
        db_table = "digital_technology_clusters"
        verbose_name = _("Digital Technology Cluster")
        verbose_name_plural = _("Digital Technology Clusters")

    def __str__(self):
        return self.name


class ProductRoadmap(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name=_("Name"))

    class Meta:
        db_table = "product_roadmaps"
        verbose_name = _("Product Roadmap")
        verbose_name_plural = _("Product Roadmaps")

    def __str__(self):
        return self.name


class TechnologyRoadmap(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name=_("Name"))

    class Meta:
        db_table = "technology_roadmaps"
        verbose_name = _("Technology Roadmap")
        verbose_name_plural = _("Technology Roadmaps")

    def __str__(self):
        return self.name


class FoMType(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name=_("Name"))

    class Meta:
        db_table = "fom_types"
        verbose_name = _("FoM Type")
        verbose_name_plural = _("FoM Types")

    def __str__(self):
        return self.name


class TargetedProgramme(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name=_("Name"))

    class Meta:
        db_table = "targeted_programmes"
        verbose_name = _("Targeted Programme")
        verbose_name_plural = _("Targeted Programmes")

    def __str__(self):
        return self.name


class ACApplication(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name=_("Name"))

    class Meta:
        db_table = "ac_applications"
        verbose_name = _("A/C Application")
        verbose_name_plural = _("A/C Applications")

    def __str__(self):
        return self.name


class Technology(models.Model):
    physical_technology_cluster = models.ForeignKey(
        'PhysicalTechnologyCluster',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='technologies',
        verbose_name=_("Physical Technology Cluster"),
    )
    digital_technology_cluster = models.ForeignKey(
        'DigitalTechnologyCluster',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='technologies',
        verbose_name=_("Digital Technology Cluster"),
    )
    product_roadmap = models.ForeignKey(
        'ProductRoadmap',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='technologies',
        verbose_name=_("Product Roadmap"),
    )
    technology_roadmap = models.ForeignKey(
        'TechnologyRoadmap',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='technologies',
        verbose_name=_("Technology Roadmap"),
    )
    technology_name = models.CharField(max_length=255, unique=True, verbose_name=_("Technology Name"))
    technology_description = models.TextField(verbose_name=_("Technology Description"), blank=True)
    current_trl = models.PositiveSmallIntegerField(verbose_name=_("Current TRL (1-9)"), choices=TRLLevel.choices, null=True, blank=True)
    trls = models.ManyToManyField(TRL, through="TechnologyTRL", related_name="technologies", verbose_name=_("TRLs"), blank=True)
    dependencies = models.JSONField(default=list, verbose_name=_("Dependencies"), help_text=_("Same list of values as Technology Cluster"), blank=True)
    fom_type = models.ManyToManyField(
        'FoMType',
        blank=True,
        related_name='technologies',
        verbose_name=_("FoM Type"),
    )
    fom_value_percent = models.DecimalField(verbose_name=_("FoM Value (%)"), max_digits=5, decimal_places=2, null=True, blank=True)
    targeted_programmes = models.ManyToManyField(
        'TargetedProgramme',
        blank=True,
        related_name='technologies',
        verbose_name=_("Targeted Programmes"),
    )
    ac_application = models.ForeignKey(
        'ACApplication',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='technologies',
        verbose_name=_("A/C Application"),
    )
    
    class Meta:
        db_table = "technologies"
        verbose_name = _("Technology")
        verbose_name_plural = _("Technologies")
        
    def __str__(self):
        return self.technology_name


class TechnologyTRL(models.Model):
    """
    Through table to relate a Technology with multiple TRL entries,
    enforcing a single TRL per TRL number (1-9) per technology.
    """

    technology = models.ForeignKey(Technology, on_delete=models.CASCADE, related_name="technology_trls")
    trl = models.ForeignKey(TRL, on_delete=models.CASCADE, related_name="technology_trls")
    trl_number = models.PositiveSmallIntegerField(choices=TRLLevel.choices, verbose_name=_("TRL Number"))

    class Meta:
        db_table = "technology_trls"
        constraints = [
            models.UniqueConstraint(
                fields=["technology", "trl_number"],
                name="uniq_technology_trl_number",
            ),
            models.UniqueConstraint(
                fields=["technology", "trl"],
                name="uniq_technology_trl",
            ),
        ]

    def save(self, *args, **kwargs):
        # Mirror the TRL number to enforce constraint consistency
        self.trl_number = self.trl.trl_number
        super().save(*args, **kwargs)