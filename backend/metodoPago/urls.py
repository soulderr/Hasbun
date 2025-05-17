from django.urls import path, include
from rest_framework import routers
from metodoPago import views

router = routers.DefaultRouter()
router.register('metodoPago', views.MetodoPagoView, basename='metodoPago')

urlpatterns = [
    path('', include(router.urls)),
]