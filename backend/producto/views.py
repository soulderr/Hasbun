from rest_framework import viewsets, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication  # ✅ Añade esto
from .models import Producto
from .serializers import ProductoSerializer
from django.http import FileResponse, Http404
import os
from django.conf import settings

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and getattr(request.user, 'rol', None) == 1

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    authentication_classes = [JWTAuthentication]  # ✅ Esto es lo que faltaba
    permission_classes = [IsAdminOrReadOnly]

def descargar_pdf(request, nombre_archivo):
    ruta = os.path.join(settings.MEDIA_ROOT, 'productos/pdfs', nombre_archivo)
    if not os.path.exists(ruta):
        raise Http404("Archivo no encontrado")
    return FileResponse(open(ruta, 'rb'), as_attachment=True, filename=nombre_archivo)
