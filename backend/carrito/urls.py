from django.urls import path, include
from rest_framework import routers
from carrito import views

router = routers.DefaultRouter()
router.register('carrito', views.CarritoView, basename='carrito')

urlpatterns = [
    path('', include(router.urls)),
]