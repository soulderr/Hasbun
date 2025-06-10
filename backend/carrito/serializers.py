from rest_framework import serializers
from .models import Carrito, ItemCarrito
from producto.models import Producto
from producto.serializers import ProductoSerializer

class ProductoInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['idProducto', 'nombreProducto']

class ProductoMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['idProducto', 'nombreProducto', 'imagen']

class ItemCarritoSerializer(serializers.ModelSerializer):
    producto = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    producto_detalle = ProductoMiniSerializer(source='producto', read_only=True)

    class Meta:
        model = ItemCarrito
        fields = ['id', 'carrito', 'producto', 'producto_detalle', 'cantidad', 'precio_unitario', 'fecha_agregado']
        read_only_fields = ['fecha_agregado']

class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'creado', 'items']


