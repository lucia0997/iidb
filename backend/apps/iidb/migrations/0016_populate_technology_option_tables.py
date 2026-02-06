# Generated manually to populate option tables with initial data

from django.db import migrations


def populate_option_tables(apps, schema_editor):
    """Populate option tables with values from the spreadsheet"""
    
    # Physical Technology Cluster
    PhysicalTechnologyCluster = apps.get_model('iidb', 'PhysicalTechnologyCluster')
    physical_clusters = [
        'Industrialization for Assembly',
        'Industrialization for Non Metal / Composites Structures',
        'Metal Structures Manufacturing Processes',
        'Manufacturing Ground Test Processes Aircraft',
        'Measurement / Verification techniques for Industrialization',
        'Manufacturing System',
        'Manufacturing, Assembly and Test Industrial Means',
        'Electrical and Electronic Manufacturing Processes',
        'None',
    ]
    for name in physical_clusters:
        PhysicalTechnologyCluster.objects.get_or_create(name=name)
    
    # Digital Technology Cluster
    DigitalTechnologyCluster = apps.get_model('iidb', 'DigitalTechnologyCluster')
    digital_clusters = [
        'Big Data and AI analytics',
        'Horizontal and vertical integration',
        'Cloud computing',
        'Augmented reality (AR)',
        'Industrial Internet of Things (IIoT)',
        'Simulation/digital twins',
        'Cybersecurity',
        'None',
    ]
    for name in digital_clusters:
        DigitalTechnologyCluster.objects.get_or_create(name=name)
    
    # Product Roadmap
    ProductRoadmap = apps.get_model('iidb', 'ProductRoadmap')
    product_roadmaps = [
        '1SES',
        '1SAT',
        '1CAC',
        '1TMA',
        '1UAS',
        '1CIS',
        'All',
    ]
    for name in product_roadmaps:
        ProductRoadmap.objects.get_or_create(name=name)
    
    # Technology Roadmap
    TechnologyRoadmap = apps.get_model('iidb', 'TechnologyRoadmap')
    technology_roadmaps = [
        '1AUT',
        '1CTY',
        '1ISM',
        '1ELE',
        '1MAT',
        '1AIC',
        '1DDM',
        '1TMV',
        '1GSY',
        '1APV',
        '1STA',
        '1NAT',
        '1NBM',
        'Undetermined',
    ]
    for name in technology_roadmaps:
        TechnologyRoadmap.objects.get_or_create(name=name)
    
    # FoM Type
    FoMType = apps.get_model('iidb', 'FoMType')
    fom_types = [
        'Weight',
        'Drag',
        'Lead Time',
        'NRCs',
        'RCs',
        'Strategic',
        'Availability',
    ]
    for name in fom_types:
        FoMType.objects.get_or_create(name=name)
    
    # Targeted Programme
    TargetedProgramme = apps.get_model('iidb', 'TargetedProgramme')
    targeted_programmes = [
        'A400M',
        'C235/295',
        'MRTT',
        'EFA 2000',
        'FCAS NGF',
        'FCAS RC',
        'Sirtap',
        'Eurodrone',
        'FALCON X',
    ]
    for name in targeted_programmes:
        TargetedProgramme.objects.get_or_create(name=name)
    
    # A/C Application
    ACApplication = apps.get_model('iidb', 'ACApplication')
    ac_applications = [
        'Cockpit',
        'Fuselage',
        'Wings',
        'Tail',
        'Engine/Propeller',
        'Landing Gear',
        'General',
    ]
    for name in ac_applications:
        ACApplication.objects.get_or_create(name=name)


def reverse_populate_option_tables(apps, schema_editor):
    """Reverse migration - delete all data from option tables"""
    PhysicalTechnologyCluster = apps.get_model('iidb', 'PhysicalTechnologyCluster')
    DigitalTechnologyCluster = apps.get_model('iidb', 'DigitalTechnologyCluster')
    ProductRoadmap = apps.get_model('iidb', 'ProductRoadmap')
    TechnologyRoadmap = apps.get_model('iidb', 'TechnologyRoadmap')
    FoMType = apps.get_model('iidb', 'FoMType')
    TargetedProgramme = apps.get_model('iidb', 'TargetedProgramme')
    ACApplication = apps.get_model('iidb', 'ACApplication')
    
    PhysicalTechnologyCluster.objects.all().delete()
    DigitalTechnologyCluster.objects.all().delete()
    ProductRoadmap.objects.all().delete()
    TechnologyRoadmap.objects.all().delete()
    FoMType.objects.all().delete()
    TargetedProgramme.objects.all().delete()
    ACApplication.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('iidb', '0015_create_technology_option_tables'),
    ]

    operations = [
        migrations.RunPython(populate_option_tables, reverse_populate_option_tables),
    ]

