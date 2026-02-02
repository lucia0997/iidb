"""
Comando de Django para inyectar datos de prueba de tecnologías directamente en la base de datos.

Uso:
    python manage.py seed_technologies
    
    # Con opciones:
    python manage.py seed_technologies --count 5
    python manage.py seed_technologies --clear  # Elimina todas las tecnologías de prueba primero
"""

from django.core.management.base import BaseCommand
from apps.iidb.models import Technology, TRL, TechnologyTRL
from decimal import Decimal


class Command(BaseCommand):
    help = "Inyecta datos de prueba de tecnologías directamente en la base de datos"

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=3,
            help='Número de tecnologías a crear (default: 3)',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina todas las tecnologías de prueba antes de crear nuevas',
        )

    def handle(self, *args, **options):
        count = options['count']
        clear = options['clear']
        
        # Datos de ejemplo para las tecnologías
        technologies_data = [
            {
                "technology_name": "Carbon Fiber Reinforced Polymers (CFRP)",
                "current_trl": 7,
                "physical_technology_cluster": "Advanced Materials",
                "digital_technology_cluster": "None",
                "product_roadmap": "Commercial Aircraft, Military Aircraft",
                "technology_roadmap": "Materials, Structures",
                "technology_description": "Lightweight composite materials for aircraft structures",
                "dependencies": ["Advanced Manufacturing"],
                "fom_type": "Weight Reduction",
                "fom_value_percent": Decimal("25.50"),
                "targeted_programmes": ["A320neo", "A330neo", "A350"],
                "ac_application": "A320neo, A330neo, A350",
                "trls": [
                    {"trl_number": 5, "trl_year": 2023, "trl_cost": Decimal("600000.00")},
                    {"trl_number": 7, "trl_year": 2025, "trl_cost": Decimal("1200000.00")},
                ]
            },
            {
                "technology_name": "Hybrid Electric Propulsion",
                "current_trl": 6,
                "physical_technology_cluster": "Propulsion Systems",
                "digital_technology_cluster": "None",
                "product_roadmap": "Commercial Aircraft, Helicopters",
                "technology_roadmap": "Propulsion, Energy Systems",
                "technology_description": "Hybrid electric propulsion systems for reduced emissions",
                "dependencies": ["Energy Storage"],
                "fom_type": "Fuel Efficiency",
                "fom_value_percent": Decimal("30.00"),
                "targeted_programmes": ["A320", "A330"],
                "ac_application": "All Commercial Aircraft",
                "trls": [
                    {"trl_number": 4, "trl_year": 2022, "trl_cost": Decimal("350000.00")},
                    {"trl_number": 6, "trl_year": 2025, "trl_cost": Decimal("900000.00")},
                ]
            },
            {
                "technology_name": "Advanced Flight Management System (FMS)",
                "current_trl": 8,
                "physical_technology_cluster": "None",
                "digital_technology_cluster": "Avionics & Software",
                "product_roadmap": "Commercial Aircraft",
                "technology_roadmap": "Avionics, Software",
                "technology_description": "Next-generation flight management systems with AI integration",
                "dependencies": ["Data Analytics"],
                "fom_type": "Operational Efficiency",
                "fom_value_percent": Decimal("15.25"),
                "targeted_programmes": ["A320", "A330", "A350", "A380"],
                "ac_application": "All Commercial Aircraft",
                "trls": [
                    {"trl_number": 6, "trl_year": 2022, "trl_cost": Decimal("900000.00")},
                    {"trl_number": 8, "trl_year": 2024, "trl_cost": Decimal("1800000.00")},
                ]
            },
            {
                "technology_name": "Automated Assembly Lines",
                "current_trl": 6,
                "physical_technology_cluster": "Structures & Manufacturing",
                "digital_technology_cluster": "None",
                "product_roadmap": "Commercial Aircraft, Military Aircraft",
                "technology_roadmap": "Manufacturing, Assembly",
                "technology_description": "Robotic assembly systems for aircraft fuselage and wing components",
                "dependencies": ["Advanced Materials"],
                "fom_type": "Production Efficiency",
                "fom_value_percent": Decimal("40.00"),
                "targeted_programmes": ["A320", "A330", "A350"],
                "ac_application": "All Commercial Aircraft",
                "trls": [
                    {"trl_number": 5, "trl_year": 2023, "trl_cost": Decimal("1300000.00")},
                    {"trl_number": 6, "trl_year": 2024, "trl_cost": Decimal("1900000.00")},
                ]
            },
            {
                "technology_name": "Aircraft Health Monitoring Systems",
                "current_trl": 7,
                "physical_technology_cluster": "Connectivity & IoT",
                "digital_technology_cluster": "None",
                "product_roadmap": "Commercial Aircraft, Helicopters",
                "technology_roadmap": "Connectivity, Data Analytics",
                "technology_description": "Real-time health monitoring and predictive maintenance systems using IoT sensors and AI",
                "dependencies": [],
                "fom_type": "Maintenance Cost Reduction",
                "fom_value_percent": Decimal("20.30"),
                "targeted_programmes": ["A320", "A330", "A350", "A380"],
                "ac_application": "All Commercial Aircraft",
                "trls": [
                    {"trl_number": 6, "trl_year": 2024, "trl_cost": Decimal("1450000.00")},
                    {"trl_number": 7, "trl_year": 2025, "trl_cost": Decimal("2000000.00")},
                ]
            },
        ]
        
        # Limpiar tecnologías de prueba si se solicita
        if clear:
            self.stdout.write("🗑️  Eliminando tecnologías de prueba existentes...")
            test_names = [tech["technology_name"] for tech in technologies_data]
            deleted = Technology.objects.filter(technology_name__in=test_names).delete()
            self.stdout.write(
                self.style.SUCCESS(f"✅ Eliminadas {deleted[0]} tecnologías de prueba")
            )
        
        # Limitar el número de tecnologías a crear
        technologies_to_create = technologies_data[:count]
        
        self.stdout.write(f"\n📦 Creando {len(technologies_to_create)} tecnologías de prueba...\n")
        
        created_count = 0
        updated_count = 0
        
        for tech_data in technologies_to_create:
            trls_data = tech_data.pop("trls", [])
            technology_name = tech_data["technology_name"]
            
            # Crear o obtener la tecnología
            technology, created = Technology.objects.get_or_create(
                technology_name=technology_name,
                defaults=tech_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Creada: {technology_name}")
                )
            else:
                updated_count += 1
                # Actualizar campos si ya existía
                for key, value in tech_data.items():
                    setattr(technology, key, value)
                technology.save()
                self.stdout.write(
                    self.style.WARNING(f"⚠️  Actualizada: {technology_name}")
                )
            
            # Procesar TRLs
            for trl_data in trls_data:
                trl_number = trl_data["trl_number"]
                trl_year = trl_data.get("trl_year")
                trl_cost = trl_data.get("trl_cost")
                
                # Buscar TRL existente que coincida exactamente
                trl = None
                trl_created = False
                
                # Primero intentar buscar uno que coincida exactamente
                if trl_year is not None and trl_cost is not None:
                    trl = TRL.objects.filter(
                        trl_number=trl_number,
                        trl_year=trl_year,
                        trl_cost=trl_cost
                    ).first()
                
                # Si no encontró uno exacto, buscar por número y actualizar o crear
                if trl is None:
                    # Buscar cualquier TRL con ese número
                    trl = TRL.objects.filter(trl_number=trl_number).first()
                    
                    if trl:
                        # Actualizar el existente
                        if trl_year is not None:
                            trl.trl_year = trl_year
                        if trl_cost is not None:
                            trl.trl_cost = trl_cost
                        trl.save()
                    else:
                        # Crear nuevo TRL
                        trl = TRL.objects.create(
                            trl_number=trl_number,
                            trl_year=trl_year,
                            trl_cost=trl_cost,
                        )
                        trl_created = True
                
                # Relacionar tecnología con TRL
                TechnologyTRL.objects.get_or_create(
                    technology=technology,
                    trl=trl,
                    defaults={"trl_number": trl_number}
                )
        
        # Resumen
        self.stdout.write("\n" + "="*60)
        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Completado: {created_count} creadas, {updated_count} actualizadas"
            )
        )
        self.stdout.write("="*60)

