from django.contrib import admin
from .models import (
    PlantProgramme,
    PhysicalTechnologyCluster, DigitalTechnologyCluster,
    ProductRoadmap, TechnologyRoadmap, FoMType,
    TargetedProgramme, ACApplication
)

@admin.register(PlantProgramme)
class PlantProgrammeAdmin(admin.ModelAdmin):
    list_display = ("technology_name", "business", "site")
    list_filter = ("business", "site")
    search_fields = ("technology_name", "business", "site")


@admin.register(PhysicalTechnologyCluster)
class PhysicalTechnologyClusterAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(DigitalTechnologyCluster)
class DigitalTechnologyClusterAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(ProductRoadmap)
class ProductRoadmapAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(TechnologyRoadmap)
class TechnologyRoadmapAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(FoMType)
class FoMTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(TargetedProgramme)
class TargetedProgrammeAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(ACApplication)
class ACApplicationAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)