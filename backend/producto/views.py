from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer
from django.http import FileResponse, Http404
import os
from django.conf import settings
# Create your views here.

class ProductoView(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

def descargar_pdf(request, nombre_archivo):
    ruta = os.path.join(settings.MEDIA_ROOT, 'productos/pdfs', nombre_archivo)
    if not os.path.exists(ruta):
        raise Http404("Archivo no encontrado")
    return FileResponse(open(ruta, 'rb'), as_attachment=True, filename=nombre_archivo)
