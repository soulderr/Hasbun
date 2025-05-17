from django.urls import path, include
from rest_framework import routers
from venta import views

router = routers.DefaultRouter()
router.register('venta', views.VentaView, basename='venta')

urlpatterns = [
    path('', include(router.urls)),
]