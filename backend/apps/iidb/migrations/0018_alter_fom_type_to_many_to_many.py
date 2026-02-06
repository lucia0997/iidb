# Generated manually to change fom_type from ForeignKey to ManyToManyField

import django.db.models.deletion
from django.db import migrations, models


def migrate_fom_type_to_many_to_many(apps, schema_editor):
    """Migrate existing data from ForeignKey to ManyToManyField"""
    Technology = apps.get_model('iidb', 'Technology')
    FoMType = apps.get_model('iidb', 'FoMType')
    
    # Migrate fom_type: convert single ForeignKey to ManyToManyField
    for tech in Technology.objects.exclude(fom_type__isnull=True):
        if tech.fom_type:
            # Add the existing fom_type to the new ManyToManyField
            tech.fom_type_new.add(tech.fom_type)


def reverse_migrate_fom_type_to_many_to_many(apps, schema_editor):
    """Reverse migration - convert ManyToManyField back to ForeignKey (take first one)"""
    Technology = apps.get_model('iidb', 'Technology')
    
    # Reverse migrate fom_type: take the first item from ManyToManyField
    for tech in Technology.objects.all():
        fom_types = list(tech.fom_type_new.all())
        if fom_types:
            tech.fom_type = fom_types[0]
            tech.save(update_fields=['fom_type'])


class Migration(migrations.Migration):

    dependencies = [
        ('iidb', '0017_alter_technology_fields_to_foreign_keys'),
    ]

    operations = [
        # Step 1: Add new ManyToManyField field
        migrations.AddField(
            model_name='technology',
            name='fom_type_new',
            field=models.ManyToManyField(
                blank=True,
                related_name='technologies_new',
                to='iidb.fomtype',
                verbose_name='FoM Type'
            ),
        ),
        
        # Step 2: Migrate data
        migrations.RunPython(migrate_fom_type_to_many_to_many, reverse_migrate_fom_type_to_many_to_many),
        
        # Step 3: Remove old ForeignKey field
        migrations.RemoveField(
            model_name='technology',
            name='fom_type',
        ),
        
        # Step 4: Rename new field to original name
        migrations.RenameField(
            model_name='technology',
            old_name='fom_type_new',
            new_name='fom_type',
        ),
        
        # Step 5: Fix related_name to match the model definition
        migrations.AlterField(
            model_name='technology',
            name='fom_type',
            field=models.ManyToManyField(
                blank=True,
                related_name='technologies',
                to='iidb.fomtype',
                verbose_name='FoM Type'
            ),
        ),
    ]

