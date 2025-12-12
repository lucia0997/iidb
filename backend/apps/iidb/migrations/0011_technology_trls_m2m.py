from django.db import migrations, models
import django.db.models.deletion


def forwards_copy_trl(apps, schema_editor):
    Technology = apps.get_model("iidb", "Technology")
    TRL = apps.get_model("iidb", "TRL")
    TechnologyTRL = apps.get_model("iidb", "TechnologyTRL")

    for tech in Technology.objects.all():
        trl = getattr(tech, "trl", None)
        if trl:
            TechnologyTRL.objects.get_or_create(
                technology=tech,
                trl=trl,
                trl_number=trl.trl_number,
            )


def noop_reverse(apps, schema_editor):
    # Reverse migration cannot restore the dropped FK cleanly.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("iidb", "0010_trl_remove_technology_trl1_cost_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="TechnologyTRL",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("trl_number", models.PositiveSmallIntegerField(choices=[(1, "TRL 1"), (2, "TRL 2"), (3, "TRL 3"), (4, "TRL 4"), (5, "TRL 5"), (6, "TRL 6"), (7, "TRL 7"), (8, "TRL 8"), (9, "TRL 9")], verbose_name="TRL Number")),
                ("technology", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="technology_trls", to="iidb.technology")),
                ("trl", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="technology_trls", to="iidb.trl")),
            ],
            options={
                "db_table": "technology_trls",
            },
        ),
        migrations.AddConstraint(
            model_name="technologytrl",
            constraint=models.UniqueConstraint(fields=("technology", "trl_number"), name="uniq_technology_trl_number"),
        ),
        migrations.AddConstraint(
            model_name="technologytrl",
            constraint=models.UniqueConstraint(fields=("technology", "trl"), name="uniq_technology_trl"),
        ),
        migrations.AddField(
            model_name="technology",
            name="trls",
            field=models.ManyToManyField(blank=True, related_name="technologies", through="iidb.TechnologyTRL", to="iidb.trl", verbose_name="TRLs"),
        ),
        migrations.RunPython(forwards_copy_trl, reverse_code=noop_reverse),
        migrations.RemoveField(
            model_name="technology",
            name="trl",
        ),
    ]

