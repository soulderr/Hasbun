from django.urls import path
from .views import IniciarPagoView
from .views import confirmar_transaccion
from .views import detalle_venta
from .views import reintentar_pago

urlpatterns = [
    path('iniciar-pago/', IniciarPagoView.as_view(), name='iniciar_pago'),
    path('confirmar-transaccion/', confirmar_transaccion, name='confirmar_transaccion'),
    path('detalle-venta/', detalle_venta, name='detalle_venta'),
    path('reintentar-pago/', reintentar_pago, name='reintentar_pago'),
]