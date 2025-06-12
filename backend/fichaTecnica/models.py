from django.db import models

class FichaTecnica(models.Model):
    nombre = models.CharField(max_length=100)
    archivo_pdf = models.FileField(upload_to='productos/pdfs/', null=True, blank=True)

    def __str__(self):
        return self.nombre