from rest_framework import serializers
from .models import Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'  

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ Agrega el rol al payload del token
        token['rol'] = user.rol
        print("🔍 TOKEN CON ROL:", token)  # 👈 Agrega esto para confirmar en consola
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['rol'] = self.user.rol  # opcional: incluye en respuesta JSON
        return data

class UsuarioRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['email', 'password']
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['rol'] = 0  # ⚠️ Forzamos que sea usuario normal
        return super().create(validated_data)