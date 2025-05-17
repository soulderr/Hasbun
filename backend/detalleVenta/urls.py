from django.urls import path, include
from rest_framework import routers
from detalleVenta import views

router = routers.DefaultRouter()
router.register('detalleVenta', views.DetalleVentaView, basename='detalleVenta')

urlpatterns = [
    path('', include(router.urls)),
]