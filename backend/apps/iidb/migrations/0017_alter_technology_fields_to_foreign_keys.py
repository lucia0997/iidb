# Generated manually to change Technology fields from CharField/JSONField to ForeignKey

import django.db.models.deletion
from django.db import migrations, models


def migrate_technology_data(apps, schema_editor):
    """Migrate existing data from CharField/JSONField to ForeignKey"""
    Technology = apps.get_model('iidb', 'Technology')
    PhysicalTechnologyCluster = apps.get_model('iidb', 'PhysicalTechnologyCluster')
    DigitalTechnologyCluster = apps.get_model('iidb', 'DigitalTechnologyCluster')
    ProductRoadmap = apps.get_model('iidb', 'ProductRoadmap')
    TechnologyRoadmap = apps.get_model('iidb', 'TechnologyRoadmap')
    FoMType = apps.get_model('iidb', 'FoMType')
    TargetedProgramme = apps.get_model('iidb', 'TargetedProgramme')
    ACApplication = apps.get_model('iidb', 'ACApplication')
    
    # Migrate physical_technology_cluster
    for tech in Technology.objects.exclude(physical_technology_cluster__isnull=True).exclude(physical_technology_cluster=''):
        cluster, _ = PhysicalTechnologyCluster.objects.get_or_create(name=tech.physical_technology_cluster)
        tech.physical_technology_cluster_new = cluster
        tech.save(update_fields=['physical_technology_cluster_new'])
    
    # Migrate digital_technology_cluster
    for tech in Technology.objects.exclude(digital_technology_cluster__isnull=True).exclude(digital_technology_cluster=''):
        cluster, _ = DigitalTechnologyCluster.objects.get_or_create(name=tech.digital_technology_cluster)
        tech.digital_technology_cluster_new = cluster
        tech.save(update_fields=['digital_technology_cluster_new'])
    
    # Migrate product_roadmap
    for tech in Technology.objects.exclude(product_roadmap__isnull=True).exclude(product_roadmap=''):
        roadmap, _ = ProductRoadmap.objects.get_or_create(name=tech.product_roadmap)
        tech.product_roadmap_new = roadmap
        tech.save(update_fields=['product_roadmap_new'])
    
    # Migrate technology_roadmap
    for tech in Technology.objects.exclude(technology_roadmap__isnull=True).exclude(technology_roadmap=''):
        roadmap, _ = TechnologyRoadmap.objects.get_or_create(name=tech.technology_roadmap)
        tech.technology_roadmap_new = roadmap
        tech.save(update_fields=['technology_roadmap_new'])
    
    # Migrate fom_type
    for tech in Technology.objects.exclude(fom_type__isnull=True).exclude(fom_type=''):
        fom, _ = FoMType.objects.get_or_create(name=tech.fom_type)
        tech.fom_type_new = fom
        tech.save(update_fields=['fom_type_new'])
    
    # Migrate ac_application
    for tech in Technology.objects.exclude(ac_application__isnull=True).exclude(ac_application=''):
        ac_app, _ = ACApplication.objects.get_or_create(name=tech.ac_application)
        tech.ac_application_new = ac_app
        tech.save(update_fields=['ac_application_new'])
    
    # Migrate targeted_programmes (JSONField to ManyToMany)
    for tech in Technology.objects.all():
        # Access the JSONField value - it should still be a list at this point
        programmes_data = getattr(tech, 'targeted_programmes', None)
        if programmes_data and isinstance(programmes_data, list):
            for prog_name in programmes_data:
                if prog_name:
                    programme, _ = TargetedProgramme.objects.get_or_create(name=str(prog_name))
                    tech.targeted_programmes_new.add(programme)


def reverse_migrate_technology_data(apps, schema_editor):
    """Reverse migration - convert ForeignKey back to CharField/JSONField"""
    Technology = apps.get_model('iidb', 'Technology')
    
    # Reverse migrate physical_technology_cluster
    for tech in Technology.objects.exclude(physical_technology_cluster_new__isnull=True):
        tech.physical_technology_cluster = tech.physical_technology_cluster_new.name if tech.physical_technology_cluster_new else ''
        tech.save(update_fields=['physical_technology_cluster'])
    
    # Reverse migrate digital_technology_cluster
    for tech in Technology.objects.exclude(digital_technology_cluster_new__isnull=True):
        tech.digital_technology_cluster = tech.digital_technology_cluster_new.name if tech.digital_technology_cluster_new else ''
        tech.save(update_fields=['digital_technology_cluster'])
    
    # Reverse migrate product_roadmap
    for tech in Technology.objects.exclude(product_roadmap_new__isnull=True):
        tech.product_roadmap = tech.product_roadmap_new.name if tech.product_roadmap_new else ''
        tech.save(update_fields=['product_roadmap'])
    
    # Reverse migrate technology_roadmap
    for tech in Technology.objects.exclude(technology_roadmap_new__isnull=True):
        tech.technology_roadmap = tech.technology_roadmap_new.name if tech.technology_roadmap_new else ''
        tech.save(update_fields=['technology_roadmap'])
    
    # Reverse migrate fom_type
    for tech in Technology.objects.exclude(fom_type_new__isnull=True):
        tech.fom_type = tech.fom_type_new.name if tech.fom_type_new else ''
        tech.save(update_fields=['fom_type'])
    
    # Reverse migrate ac_application
    for tech in Technology.objects.exclude(ac_application_new__isnull=True):
        tech.ac_application = tech.ac_application_new.name if tech.ac_application_new else ''
        tech.save(update_fields=['ac_application'])
    
    # Reverse migrate targeted_programmes
    for tech in Technology.objects.all():
        programmes = list(tech.targeted_programmes_new.values_list('name', flat=True))
        tech.targeted_programmes = programmes
        tech.save(update_fields=['targeted_programmes'])


class Migration(migrations.Migration):

    dependencies = [
        ('iidb', '0016_populate_technology_option_tables'),
    ]

    operations = [
        # Step 1: Add new ForeignKey fields (nullable initially)
        migrations.AddField(
            model_name='technology',
            name='physical_technology_cluster_new',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='technologies',
                to='iidb.physicaltechnologycluster',
                verbose_name='Physical Technology Cluster'
            ),
        ),
        migrations.AddField(
            model_name='technology',
            name='digital_technology_cluster_new',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='technologies',
                to='iidb.digitaltechnologycluster',
                verbose_name='Digital Technology Cluster'
            ),
        ),
        migrations.AddField(
            model_name='technology',
            name='product_roadmap_new',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='technologies',
                to='iidb.productroadmap',
                verbose_name='Product Roadmap'
            ),
        ),
        migrations.AddField(
            model_name='technology',
            name='technology_roadmap_new',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='technologies',
                to='iidb.technologyroadmap',
                verbose_name='Technology Roadmap'
            ),
        ),
        migrations.AddField(
            model_name='technology',
            name='fom_type_new',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='technologies',
                to='iidb.fomtype',
                verbose_name='FoM Type'
            ),
        ),
        migrations.AddField(
            model_name='technology',
            name='ac_application_new',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='technologies',
                to='iidb.acapplication',
                verbose_name='A/C Application'
            ),
        ),
        migrations.AddField(
            model_name='technology',
            name='targeted_programmes_new',
            field=models.ManyToManyField(
                blank=True,
                related_name='technologies',
                to='iidb.targetedprogramme',
                verbose_name='Targeted Programmes'
            ),
        ),
        
        # Step 2: Migrate data
        migrations.RunPython(migrate_technology_data, reverse_migrate_technology_data),
        
        # Step 3: Remove old fields
        migrations.RemoveField(
            model_name='technology',
            name='physical_technology_cluster',
        ),
        migrations.RemoveField(
            model_name='technology',
            name='digital_technology_cluster',
        ),
        migrations.RemoveField(
            model_name='technology',
            name='product_roadmap',
        ),
        migrations.RemoveField(
            model_name='technology',
            name='technology_roadmap',
        ),
        migrations.RemoveField(
            model_name='technology',
            name='fom_type',
        ),
        migrations.RemoveField(
            model_name='technology',
            name='ac_application',
        ),
        migrations.RemoveField(
            model_name='technology',
            name='targeted_programmes',
        ),
        
        # Step 4: Rename new fields to original names
        migrations.RenameField(
            model_name='technology',
            old_name='physical_technology_cluster_new',
            new_name='physical_technology_cluster',
        ),
        migrations.RenameField(
            model_name='technology',
            old_name='digital_technology_cluster_new',
            new_name='digital_technology_cluster',
        ),
        migrations.RenameField(
            model_name='technology',
            old_name='product_roadmap_new',
            new_name='product_roadmap',
        ),
        migrations.RenameField(
            model_name='technology',
            old_name='technology_roadmap_new',
            new_name='technology_roadmap',
        ),
        migrations.RenameField(
            model_name='technology',
            old_name='fom_type_new',
            new_name='fom_type',
        ),
        migrations.RenameField(
            model_name='technology',
            old_name='ac_application_new',
            new_name='ac_application',
        ),
        migrations.RenameField(
            model_name='technology',
            old_name='targeted_programmes_new',
            new_name='targeted_programmes',
        ),
    ]

