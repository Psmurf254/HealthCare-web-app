# Generated by Django 4.2.9 on 2024-03-13 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('specialists', '0010_rename_achievements_specialist_achievements_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='specialist',
            name='status',
            field=models.CharField(choices=[('active', 'Active'), ('in_active', 'In_Active')], default='in_active', max_length=20),
        ),
    ]
