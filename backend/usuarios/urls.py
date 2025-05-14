from django.urls import path, include
from rest_framework import routers
from usuarios import views

router = routers.DefaultRouter()
router.register('usuario', views.UsuarioView, basename='usuarios')

urlpatterns = [
    path('', include(router.urls)),
]