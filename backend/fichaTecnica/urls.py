from django.urls import path
from .views import descargar_pdf

urlpatterns = [
    path('descargar-pdf/<str:nombre_archivo>/', descargar_pdf, name='descargar_pdf'),
]
