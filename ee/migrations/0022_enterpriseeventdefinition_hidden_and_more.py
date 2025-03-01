# Generated by Django 4.2.18 on 2025-02-27 19:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("ee", "0021_conversation_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="enterpriseeventdefinition",
            name="hidden",
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name="enterprisepropertydefinition",
            name="hidden",
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
