from django.db import models

class Venta(models.Model):
    idVenta = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('usuarios.Usuario', on_delete=models.PROTECT)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    estado = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('fallido', 'Fallido'),
        ('cancelado', 'Cancelado'),
    ], default='pendiente')  # Default útil

    metodo_pago = models.ForeignKey('metodoPago.MetodoPago', on_delete=models.PROTECT, null=True, blank=True)

    # 🔐 Token transacción Webpay (opcional pero recomendable)
    token_webpay = models.CharField(max_length=255, null=True, blank=True)

    # 🆔 Código de orden que usas en Transbank
    orden_compra = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"Venta {self.idVenta} - Usuario: {self.id_usuario} - Total: {self.total} - Estado: {self.estado}"
