from django.apps import AppConfig

class IidbConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.iidb"
    label = "iidb"
    verbose_name = "Industrial Innovation DB"
    
    def ready(self):
        from .models import plant_programme #noqa: F401