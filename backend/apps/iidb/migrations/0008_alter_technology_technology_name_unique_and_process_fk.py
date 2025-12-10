# Generated manually to fix ForeignKey to_field issue

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iidb', '0007_project'),
    ]

    operations = [
        # Paso 1: PRIMERO hacer technology_name único en Technology
        # Esto DEBE ejecutarse primero para crear el índice único necesario
        migrations.AlterField(
            model_name='technology',
            name='technology_name',
            field=models.CharField(max_length=255, unique=True, verbose_name='Technology Name'),
        ),
        
        # Paso 2: Eliminar el campo CharField de Process
        migrations.RemoveField(
            model_name='process',
            name='technology_name',
        ),
        
        # Paso 3: Crear el ForeignKey en Process apuntando al campo technology_name
        # Ahora que el índice único existe, podemos crear el ForeignKey
        migrations.AddField(
            model_name='process',
            name='technology_name',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to='iidb.technology',
                to_field='technology_name',
                verbose_name='Technology Name'
            ),
        ),
    ]

