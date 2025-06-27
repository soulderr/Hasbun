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
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import permissions
from .serializers import MyTokenObtainPairSerializer
from .utils import enviar_correo_bienvenida

User = get_user_model()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def validate(self, attrs):
        data = super().validate(attrs)

        data['rol'] = self.user.rol
        data['usuario_id'] = self.user.id  # ✅ Esto agrega el ID del usuario

        return data

class RegisterView(APIView):
    def post(self, request):
        try:
            username = request.data['email']
            password = make_password(request.data['password'])
            first_name = request.data.get('first_name', '')
            last_name = request.data.get('last_name', '')
            rut = request.data.get('rut', '')
            direccion = request.data.get('direccion', '')
            
            if User.objects.filter(username=username).exists():
                return Response({"error": "El usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create(
                username=username,
                email=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                rut=rut,
                direccion=direccion,
                rol=0
            )

            enviar_correo_bienvenida(user)

            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            access_token['rol'] = user.rol

            return Response({
                'refresh': str(refresh),
                'access': str(access_token),
                'rol': user.rol,
                "usuario_id": user.id,
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
            return Response({'error': 'Usuario inválido'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)

        nueva_contrasena = request.data.get('password')
        if not nueva_contrasena:
            return Response({'error': 'Debe proporcionar una nueva contraseña'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(nueva_contrasena)
        user.save()

        return Response({'mensaje': 'Contraseña restablecida con éxito ✅'}, status=status.HTTP_200_OK)

class CrearAdministradorView(APIView):
    permission_classes = [permissions.IsAdminUser]  # Solo superusuarios o personal staff

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña son requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Ya existe un usuario con ese email.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            email=email,
            username=email,
            password=make_password(password),
            rol=1,
            is_staff=True  # Opcional, si deseas acceso al panel admin
        )

        return Response({'mensaje': 'Administrador creado exitosamente ✅'}, status=status.HTTP_201_CREATED)