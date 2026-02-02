"""
Comando de Django para borrar todas las tablas de la base de datos respetando el orden de FK.

Uso:
    python manage.py clear_all_tables
    
    # Con confirmación automática (útil para scripts):
    python manage.py clear_all_tables --no-input
"""

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from apps.iidb.models import (
    TechnologyTRL,  # Tabla intermedia M2M (depende de Technology y TRL)
    Process,        # FK a Technology
    PlantProgramme, # FK a Technology
    Technology,     # M2M con TRL (pero la tabla intermedia ya se borró)
    TRL,            # Independiente
    Strategy,       # Independiente
    Project,        # Independiente
)


class Command(BaseCommand):
    help = "Borra todas las tablas de la base de datos respetando el orden de claves foráneas"

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Ejecuta sin pedir confirmación (útil para scripts)',
        )

    def handle(self, *args, **options):
        no_input = options['no_input']
        
        # Orden de borrado: de más dependiente a menos dependiente
        # Este orden respeta las claves foráneas
        models_to_delete = [
            ("TechnologyTRL", TechnologyTRL),      # Tabla intermedia M2M (depende de Technology y TRL)
            ("Process", Process),                 # FK a Technology
            ("PlantProgramme", PlantProgramme),   # FK a Technology
            ("Technology", Technology),          # M2M con TRL (pero la tabla intermedia ya se borró)
            ("TRL", TRL),                        # Independiente
            ("Strategy", Strategy),              # Independiente
            ("Project", Project),                # Independiente
        ]
        
        if not no_input:
            self.stdout.write(self.style.WARNING("\n⚠️  ADVERTENCIA: Esto borrará TODOS los datos de las siguientes tablas:"))
            for name, model in models_to_delete:
                count = model.objects.count()
                self.stdout.write(f"   - {name}: {count} registros")
            
            confirm = input("\n¿Estás seguro de que quieres continuar? (yes/no): ")
            if confirm.lower() not in ['yes', 'y', 'sí', 'si']:
                self.stdout.write(self.style.ERROR("Operación cancelada."))
                return
        
        self.stdout.write("\n🗑️  Iniciando borrado de tablas...\n")
        
        total_deleted = 0
        
        try:
            with transaction.atomic():
                for model_name, model in models_to_delete:
                    count = model.objects.count()
                    
                    if count > 0:
                        self.stdout.write(f"Borrando {model_name}... ({count} registros)", ending="")
                        deleted_count, _ = model.objects.all().delete()
                        total_deleted += deleted_count
                        self.stdout.write(self.style.SUCCESS(f" ✅ ({deleted_count} eliminados)"))
                    else:
                        self.stdout.write(f"Saltando {model_name}... (vacía)", ending="")
                        self.stdout.write(self.style.WARNING(" ⚠️"))
                
                self.stdout.write("\n" + "="*60)
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✅ Completado: {total_deleted} registros eliminados en total"
                    )
                )
                self.stdout.write("="*60)
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"\n❌ Error durante el borrado: {str(e)}"))
            raise CommandError(f"Error al borrar tablas: {str(e)}")

