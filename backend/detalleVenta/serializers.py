from rest_framework import serializers
from .models import DetalleVenta

# from rest_framework import viewsets

class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = '__all__'  # Esto incluye todos los campos del modelo

