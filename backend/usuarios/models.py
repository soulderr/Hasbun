from django.db import models

# Create your models here.

class Usuario(models.Model):
    idUsuario = models.AutoField(primary_key=True)
    id_cotizacion = models.ForeignKey('cotizacion.Cotizacion', on_delete=models.PROTECT, null=True, blank=True)#para poder crear el usuario sin tener una cotizacion vinculada
    nombreUsuario = models.CharField(max_length=23)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=20)
    rol = models.IntegerField(default=0)  # 0: usuario, 1: administrador
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombreUsuario} {self.rol} "
