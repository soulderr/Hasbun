from django.urls import path, include
from rest_framework import routers
from producto import views
from .views import descargar_pdf

router = routers.DefaultRouter()
router.register(r'', views.ProductoView, basename='producto')

urlpatterns = [
    path('', include(router.urls)),
    path('descargar-pdf/<str:nombre_archivo>/', descargar_pdf, name='descargar_pdf'),
]