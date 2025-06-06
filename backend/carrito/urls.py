from django.urls import path
from .views import CarritoListCreateView, ItemCarritoListCreateView, ItemCarritoListView
from .views import ItemCarritoDetailView, VaciarCarritoView    
urlpatterns = [
    path('', CarritoListCreateView.as_view(), name='carrito'),
    path('items/', ItemCarritoListCreateView.as_view(), name='item_carrito'),
    path('items/', ItemCarritoListView.as_view(), name='item_carrito'),
    path('items/vaciar/<int:carrito_id>/', VaciarCarritoView.as_view(), name='vaciar_carrito'),

]
urlpatterns += [
    path('items/<int:pk>/', ItemCarritoDetailView.as_view(), name='item_carrito_detalle'),
]
