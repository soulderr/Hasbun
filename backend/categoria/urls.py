from django.urls import path, include
from rest_framework import routers
from categoria import views

router = routers.DefaultRouter()
router.register('categoria', views.CategoriaView, basename='categoria')

urlpatterns = [
    path('', include(router.urls)),
]