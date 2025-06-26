from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    first_name = models.CharField(max_length=150)  # sin blank=True
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    rol = models.IntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  

    def __str__(self):
        return self.email