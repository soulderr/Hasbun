# Generated by Django 5.2 on 2025-05-17 07:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categoria', '0001_initial'),
        ('detalleVenta', '0002_detalleventa_id_venta'),
        ('producto', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='producto',
            name='id_categoria',
            field=models.ForeignKey(blank=True, db_column='id_categoria', null=True, on_delete=django.db.models.deletion.PROTECT, to='categoria.categoria'),
        ),
        migrations.AddField(
            model_name='producto',
            name='id_detalleVenta',
            field=models.ForeignKey(blank=True, db_column='id_detalleVenta', null=True, on_delete=django.db.models.deletion.PROTECT, to='detalleVenta.detalleventa'),
        ),
    ]
