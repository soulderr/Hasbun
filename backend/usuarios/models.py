from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    first_name = models.CharField(max_length=150)  
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    rol = models.IntegerField(default=0)
    rut = models.CharField(max_length=12, null=True, blank=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  

    def __str__(self):
        return self.email