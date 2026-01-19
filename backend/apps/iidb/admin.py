from django.contrib import admin
from .models import PlantProgramme

@admin.register(PlantProgramme)
class PlantProgrammeAdmin(admin.ModelAdmin):
    list_display = ("technology_name", "business", "site")
    list_filter = ("business", "site")
    search_fields = ("technology_name", "business", "site")