# Generated by Django 5.2 on 2025-06-25 05:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('detalleVenta', '0002_detalleventa_id_venta'),
        ('venta', '0003_venta_orden_compra_venta_token_webpay_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detalleventa',
            name='id_venta',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='detalles', to='venta.venta'),
        ),
    ]
