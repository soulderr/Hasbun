from django.db import models

# Create your models here.

class Carrito(models.Model):
    idCarrito = models.AutoField(primary_key=True)
    #idUsuario = models.ForeignKey('usuarios.Usuario', on_delete=models.PROTECT)
    #idProducto = models.ForeignKey('productos.Producto', on_delete=models.PROTECT, null=True, blank=True)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_agregado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Carrito {self.idCarrito} - Cantidad: {self.cantidad} - Precio Unitario: {self.precio_unitario}"