from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
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
