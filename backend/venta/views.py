from rest_framework import viewsets
from .models import Venta
from .serializers import VentaSerializer

# Create your views here.

class VentaView(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer