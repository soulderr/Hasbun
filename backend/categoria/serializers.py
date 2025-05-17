from rest_framework import serializers
from .models import Categoria

# from rest_framework import viewsets

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'  # Esto incluye todos los campos del modelo

