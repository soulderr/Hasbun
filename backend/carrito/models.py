from django.db import models
from django.contrib.auth.models import User
from producto.models import Producto  # ajusta si tu app se llama diferente
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

class Carrito(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carrito'
    )
    creado = models.DateTimeField(auto_now_add=True)

class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_agregado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.producto.nombreProducto} x{self.cantidad}"

class VaciarCarritoView(APIView):
    def delete(self, request, carrito_id):
        items = ItemCarrito.objects.filter(carrito_id=carrito_id)
        deleted_count = items.count()
        items.delete()
        return Response({'message': f'{deleted_count} items eliminados del carrito'}, status=status.HTTP_200_OK)