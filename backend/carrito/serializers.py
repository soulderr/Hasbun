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
        read_only_fields = ['carrito', 'fecha_agregado']

    def validate(self, data):
        producto = data['producto']
        cantidad = data['cantidad']

        if producto.stock < cantidad:
            raise serializers.ValidationError(f"Solo hay {producto.stock} unidades disponibles.")
        
        return data

    def update(self, instance, validated_data):
        instance.cantidad = validated_data.get('cantidad', instance.cantidad)

        # Validar nuevamente en caso de update manual
        if instance.producto.stock < instance.cantidad:
            raise serializers.ValidationError(f"Stock insuficiente. Máximo disponible: {instance.producto.stock}")
        
        instance.save()
        return instance



class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'creado', 'items']


