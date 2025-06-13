from rest_framework import viewsets, permissions
from .models import Producto
from .serializers import ProductoSerializer
from django.http import FileResponse, Http404
import os
from django.conf import settings

# Create your views here.

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Solo permite edición si el usuario es administrador (rol == 1).
    """

    def has_permission(self, request, view):
        # Permitir lectura (GET, HEAD, OPTIONS) a cualquiera
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Solo permitir escritura si es admin (asumiendo que tienes user.rol)
        return request.user.is_authenticated and getattr(request.user, 'rol', None) == 1

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAdminOrReadOnly]

def descargar_pdf(request, nombre_archivo):
    ruta = os.path.join(settings.MEDIA_ROOT, 'productos/pdfs', nombre_archivo)
    if not os.path.exists(ruta):
        raise Http404("Archivo no encontrado")
    return FileResponse(open(ruta, 'rb'), as_attachment=True, filename=nombre_archivo)
