from rest_framework import serializers
from .models import FichaTecnica

class FichaTecnicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaTecnica
        fields = ['id', 'nombre', 'archivo_pdf']
