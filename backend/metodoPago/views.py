from rest_framework import viewsets
from .models import MetodoPago
from .serializers import MetodoPagoSerializer

class MetodoPagoView(viewsets.ModelViewSet):
    queryset = MetodoPago.objects.all()
    serializer_class = MetodoPagoSerializer