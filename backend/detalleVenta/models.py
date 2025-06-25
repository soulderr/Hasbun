from django.db import models

class DetalleVenta(models.Model):
    idDetalleVenta = models.AutoField(primary_key=True)

    id_venta = models.ForeignKey(
    'venta.Venta',
    on_delete=models.CASCADE,
    null=False,
    blank=False,
    related_name='detalles'
)

    id_producto = models.ForeignKey(
    'producto.Producto',
    on_delete=models.PROTECT,
    null=True,
    blank=True  # temporal
)

    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        # Calcula automáticamente el subtotal antes de guardar
        self.subtotal = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)

    def __str__(self):
        return f"DetalleVenta #{self.idDetalleVenta} | {self.id_producto.nombreProducto} x {self.cantidad}"
