from rest_framework import serializers
from .models import Cotizacion

# from rest_framework import viewsets

class CotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cotizacion
        fields = '__all__'  # Esto incluye todos los campos del modelo

