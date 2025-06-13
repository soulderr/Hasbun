from rest_framework import generics, permissions
from .models import Contacto
from .serializers import ContactoSerializer

class CrearMensajeContactoView(generics.CreateAPIView):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
    permission_classes = [permissions.AllowAny]  # ✅ Invitados y usuarios pueden enviar

class ListarMensajesAdminView(generics.ListAPIView):
    queryset = Contacto.objects.all().order_by('-fecha_envio')
    serializer_class = ContactoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self.request.user, 'rol', None) == 1:
            return super().get_queryset()
        return Contacto.objects.none()

class EliminarMensajeContactoView(generics.DestroyAPIView):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self.request.user, 'rol', None) == 1:
            return super().get_queryset()
        return Contacto.objects.none()