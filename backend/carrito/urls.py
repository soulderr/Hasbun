from django.urls import path
from .views import (
    CarritoListCreateView,
    ItemCarritoListCreateView,
    ItemCarritoDetalleView,
    VaciarCarritoView
)

urlpatterns = [
    path('', CarritoListCreateView.as_view(), name='carrito'),
    path('items/', ItemCarritoListCreateView.as_view(), name='item_carrito'),
    path('items/vaciar/<int:carrito_id>/', VaciarCarritoView.as_view(), name='vaciar_carrito'),
    path('items/<int:pk>/', ItemCarritoDetalleView.as_view(), name='itemcarrito-detalle'),
]