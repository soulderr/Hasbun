from django.db import models

# Create your models here.

class Cotizacion(models.Model):
    idCotizacion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('usuarios.Usuario', on_delete=models.PROTECT)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_vigencia = models.DateTimeField()
    precioTotal = models.DecimalField(max_digits=11, decimal_places=2)
    estado = models.IntegerField(default=0)  # 0: pendiente, 1: aceptada, 2: rechazada

    def __str__(self):
        return f"{self.idCotizacion} {self.precioTotal }{self.estado} "
    
