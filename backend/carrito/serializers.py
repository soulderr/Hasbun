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
        fields = ['idProducto', 'nombreProducto', 'imagen', 'stock']

class ItemCarritoSerializer(serializers.ModelSerializer):
    producto = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    producto_detalle = ProductoMiniSerializer(source='producto', read_only=True)

    class Meta:
        model = ItemCarrito
        fields = ['id', 'carrito', 'producto', 'producto_detalle', 'cantidad', 'precio_unitario', 'fecha_agregado']
        read_only_fields = ['carrito', 'fecha_agregado']

    def validate(self, data):
        # Si es actualización, usar el producto del instance
        producto = data.get('producto', getattr(self.instance, 'producto', None))
        cantidad = data.get('cantidad', getattr(self.instance, 'cantidad', None))

        if producto is None:
            raise serializers.ValidationError("Debe especificar un producto válido.")

        if cantidad is None or cantidad <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor que cero.")

        # Validar stock disponible
        if producto.stock < cantidad:
            raise serializers.ValidationError(
                {"cantidad": f"⚠️ Solo hay {producto.stock} unidades disponibles de '{producto.nombreProducto}'."}
            )

        return data

    def update(self, instance, validated_data):
        nueva_cantidad = validated_data.get('cantidad', instance.cantidad)

        if nueva_cantidad > instance.producto.stock:
            raise serializers.ValidationError({
                "cantidad": f"Solo hay {instance.producto.stock} unidades disponibles."
            })

        instance.cantidad = nueva_cantidad
        instance.save()
        return instance



class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'creado', 'items']


