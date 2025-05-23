# Generated by Django 5.2 on 2025-05-16 07:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('usuarios', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Carrito',
            fields=[
                ('idCarrito', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad', models.PositiveIntegerField()),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fecha_agregado', models.DateTimeField(auto_now_add=True)),
                ('idUsuario', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='usuarios.usuario')),
            ],
        ),
    ]
