from rest_framework import viewsets
from .models import Categoria
from .serializers import CategoriaSerializer

class CategoriaView(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer