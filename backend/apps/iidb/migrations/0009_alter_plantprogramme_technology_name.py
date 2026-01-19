# Generated manually to convert PlantProgramme.technology_name to ForeignKey

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iidb', '0008_alter_technology_technology_name_unique_and_process_fk'),
    ]

    operations = [
        # Paso 1: Eliminar el campo CharField de PlantProgramme
        migrations.RemoveField(
            model_name='plantprogramme',
            name='technology_name',
        ),
        
        # Paso 2: Crear el ForeignKey en PlantProgramme apuntando al campo technology_name
        # El índice único ya existe gracias a la migración 0008
        migrations.AddField(
            model_name='plantprogramme',
            name='technology_name',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to='iidb.technology',
                to_field='technology_name',
                verbose_name='Technology Name',
                null=True,
                blank=True,
            ),
        ),
    ]

