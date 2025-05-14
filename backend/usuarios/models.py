from django.db import models

# Create your models here.

class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    #id_cotizacion = models.ForeignKey('Cotizacion', on_delete=models.PROTECT)
    nombreUsuario = models.CharField(max_length=23)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=20)
    rol = models.IntegerField(default=0)  # 0: usuario, 1: administrador
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombreUsuario} {self.rol} "
