from django.core.management.base import BaseCommand
from carrito.models import Carrito
from datetime import timedelta
from django.utils import timezone

class Command(BaseCommand):
    help = "Vacía carritos sin compra en las últimas 24 horas"

    def handle(self, *args, **kwargs):
        limite = timezone.now() - timedelta(hours=24)

        carritos = Carrito.objects.filter(creado__lt=limite)

        total_vaciados = 0
        for carrito in carritos:
            carrito.items.all().delete()
            total_vaciados += 1

        self.stdout.write(self.style.SUCCESS(f"✅ {total_vaciados} carritos vaciados"))
