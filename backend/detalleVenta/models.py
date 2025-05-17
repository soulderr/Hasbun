from django.db import models

# Create your models here.
class DetalleVenta(models.Model):
    idDetalleVenta = models.AutoField(primary_key=True)
    id_venta = models.ForeignKey('venta.Venta', on_delete=models.PROTECT, null=True, blank=True)
    id_producto = models.ForeignKey('producto.Producto', on_delete=models.PROTECT, null=True, blank=True)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"DetalleVenta {self.idDetalleVenta} - Producto: {self.id_producto.nombreProducto} - Cantidad: {self.cantidad} - Precio Unitario: {self.precio_unitario} - Subtotal: {self.subtotal}"
        
    
   