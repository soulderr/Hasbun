from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.conf import settings

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        try:
            username = request.data['email']
            password = make_password(request.data['password'])

            if User.objects.filter(username=username).exists():
                return Response({"error": "El usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create(username=username, email=username, password=password)
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Vista para solicitar recuperación

class SolicitudRecuperacionPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'El email es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No se encontró usuario con ese correo'}, status=status.HTTP_404_NOT_FOUND)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"http://localhost:5173/restablecer-password/{uid}/{token}/"

        send_mail(
            subject='Recuperación de contraseña',
            message=f'Haz clic en el siguiente enlace para restablecer tu contraseña: {reset_url}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({'message': 'Correo de recuperación enviado'}, status=status.HTTP_200_OK)

# Vista para cambiar la contraseña
class RecuperacionPasswordView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Enlace inválido o usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Token inválido o expirado.'}, status=status.HTTP_401_UNAUTHORIZED)

        password = request.data.get("password")
        if not password or len(password) < 6:
            return Response({'password': ['Debe tener al menos 6 caracteres.']}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        return Response({'message': 'Contraseña actualizada correctamente'})