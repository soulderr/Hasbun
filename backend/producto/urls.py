from django.urls import path, include
from rest_framework import routers
from producto import views

router = routers.DefaultRouter()
router.register('producto', views.ProductoView, basename='producto')

urlpatterns = [
    path('', include(router.urls)),
]