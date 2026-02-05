# Generated manually to create option tables for Technology fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iidb', '0014_remove_technology_product_domains_and_more'),
    ]

    operations = [
        # Physical Technology Cluster
        migrations.CreateModel(
            name='PhysicalTechnologyCluster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'Physical Technology Cluster',
                'verbose_name_plural': 'Physical Technology Clusters',
                'db_table': 'physical_technology_clusters',
            },
        ),
        
        # Digital Technology Cluster
        migrations.CreateModel(
            name='DigitalTechnologyCluster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'Digital Technology Cluster',
                'verbose_name_plural': 'Digital Technology Clusters',
                'db_table': 'digital_technology_clusters',
            },
        ),
        
        # Product Roadmap
        migrations.CreateModel(
            name='ProductRoadmap',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'Product Roadmap',
                'verbose_name_plural': 'Product Roadmaps',
                'db_table': 'product_roadmaps',
            },
        ),
        
        # Technology Roadmap
        migrations.CreateModel(
            name='TechnologyRoadmap',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'Technology Roadmap',
                'verbose_name_plural': 'Technology Roadmaps',
                'db_table': 'technology_roadmaps',
            },
        ),
        
        # FoM Type
        migrations.CreateModel(
            name='FoMType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'FoM Type',
                'verbose_name_plural': 'FoM Types',
                'db_table': 'fom_types',
            },
        ),
        
        # Targeted Programme
        migrations.CreateModel(
            name='TargetedProgramme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'Targeted Programme',
                'verbose_name_plural': 'Targeted Programmes',
                'db_table': 'targeted_programmes',
            },
        ),
        
        # A/C Application
        migrations.CreateModel(
            name='ACApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Name')),
            ],
            options={
                'verbose_name': 'A/C Application',
                'verbose_name_plural': 'A/C Applications',
                'db_table': 'ac_applications',
            },
        ),
    ]

