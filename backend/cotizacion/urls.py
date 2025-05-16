from django.urls import path, include
from rest_framework import routers
from cotizacion import views

router = routers.DefaultRouter()
router.register('cotizacion', views.CotizacionView, basename='cotizacion')

urlpatterns = [
    path('', include(router.urls)),
]