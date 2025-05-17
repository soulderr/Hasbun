from rest_framework import serializers
from .models import MetodoPago

# from rest_framework import viewsets

class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = '__all__'  # Esto incluye todos los campos del modelo

