from django.contrib.auth.models import AbstractUser
from django.db import models



class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    rol = models.IntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

        

