from rest_framework import serializers
from .models import Carrito, ItemCarrito
from producto.models import Producto


class ItemCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCarrito
        fields = '__all__'
        read_only_fields = ['precio_unitario']  # <- Esto es importante

    def create(self, validated_data):
        producto = validated_data.get('producto')
        validated_data['precio_unitario'] = producto.precioProducto  # <- Calcula automáticamente
        return super().create(validated_data)


class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'creado', 'items']


