from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    rol = models.IntegerField(default=0)  # 0: usuario, 1: administrador

    USERNAME_FIELD = 'email'  # Usar el campo email como identificador para login
    REQUIRED_FIELDS = ['username']  # Campos requeridos al crear superusuarios

    def __str__(self):
        return self.email