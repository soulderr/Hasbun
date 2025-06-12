from rest_framework import serializers
from .models import Producto
from fichaTecnica.serializers import FichaTecnicaSerializer

class ProductoSerializer(serializers.ModelSerializer):
    ficha_tecnica = FichaTecnicaSerializer(read_only=True)

    class Meta:
        model = Producto
        fields = [
            'idProducto',
            'id_categoria',
            'id_detalleVenta',
            'nombreProducto',
            'imagen',
            'id_carrito',
            'precioNeto',
            'stock',
            'descripcion',
            'ficha_tecnica',  
        ]