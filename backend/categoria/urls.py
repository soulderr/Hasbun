from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaView

router = DefaultRouter()

router.register(r'', CategoriaView, basename='categoria')

urlpatterns = [
    path('', include(router.urls)),
]