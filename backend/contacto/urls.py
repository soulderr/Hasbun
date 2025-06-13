from django.urls import path
from .views import CrearMensajeContactoView, ListarMensajesAdminView, EliminarMensajeContactoView

urlpatterns = [
    path('enviar/', CrearMensajeContactoView.as_view(), name='enviar-contacto'),
    path('mensajes/', ListarMensajesAdminView.as_view(), name='listar-contacto'),
    path('mensajes/<int:pk>/', EliminarMensajeContactoView.as_view(), name='eliminar-contacto'),
]
