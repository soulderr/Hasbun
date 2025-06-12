from django.urls import path, include
from .views import SolicitudRecuperacionPasswordView, RecuperacionPasswordView
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CrearAdministradorView



urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('solicitar-recuperacion/', SolicitudRecuperacionPasswordView.as_view(), name='solicitar_recuperacion'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('recuperar/<uidb64>/<token>/', RecuperacionPasswordView.as_view(), name='recuperar_contrasena'),
    path('crear-administrador/', CrearAdministradorView.as_view(), name='crear_administrador'),
]