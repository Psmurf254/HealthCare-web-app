# Generated by Django 4.2.9 on 2024-01-29 06:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('specialists', '0004_alter_appointment_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='specialist',
            name='description',
            field=models.TextField(blank=True, null='True'),
            preserve_default='True',
        ),
        migrations.AddField(
            model_name='specialist',
            name='pricing',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
