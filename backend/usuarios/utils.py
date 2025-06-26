from django.core.mail import send_mail
from django.conf import settings

def enviar_correo_bienvenida(usuario):
    asunto = "Bienvenido a Hasbun"
    mensaje = f"Hola {usuario.first_name}, gracias por registrarte en nuestra plataforma."
    destinatario = [usuario.email]

    send_mail(asunto, mensaje, settings.EMAIL_HOST_USER, destinatario)