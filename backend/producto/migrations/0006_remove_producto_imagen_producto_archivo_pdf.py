# Generated by Django 5.2 on 2025-06-12 01:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('producto', '0005_remove_producto_peso'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='producto',
            name='imagen',
        ),
        migrations.AddField(
            model_name='producto',
            name='archivo_pdf',
            field=models.FileField(blank=True, null=True, upload_to='productos/pdfs/'),
        ),
    ]
