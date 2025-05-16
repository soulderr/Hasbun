from rest_framework import viewsets
from .models import Cotizacion
from .serializers import CotizacionSerializer

class CotizacionView(viewsets.ModelViewSet):
    queryset = Cotizacion.objects.all()
    serializer_class = CotizacionSerializer