from django.urls import path, include
from rest_framework.routers import DefaultRouter
from producto import views
from .views import descargar_pdf

router = DefaultRouter()
router.register(r'', views.ProductoViewSet, basename='producto')

urlpatterns = [
    path('', include(router.urls)),
    path('descargar-pdf/<str:nombre_archivo>/', descargar_pdf, name='descargar_pdf'),
]