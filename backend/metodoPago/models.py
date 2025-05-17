from django.db import models

# Create your models here.

class MetodoPago(models.Model):
    idMetodoPago = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre