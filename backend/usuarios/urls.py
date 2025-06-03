from django.urls import path, include
from rest_framework import routers
from .views import SolicitudRecuperacionPasswordView, RecuperacionPasswordView

router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    path('solicitar-recuperacion/', SolicitudRecuperacionPasswordView.as_view(), name='solicitar_recuperacion'),
    path('recuperar/<uidb64>/<token>/', RecuperacionPasswordView.as_view(), name='recuperar_contrasena'),
]