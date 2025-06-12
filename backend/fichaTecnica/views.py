import os
from django.conf import settings
from django.http import HttpResponse, Http404

def descargar_pdf(request, nombre_archivo):
    ruta_archivo = os.path.join(settings.MEDIA_ROOT, 'productos', 'pdfs', nombre_archivo)

    if not os.path.exists(ruta_archivo):
        raise Http404("Archivo no encontrado")

    with open(ruta_archivo, 'rb') as archivo:
        response = HttpResponse(archivo.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{nombre_archivo}"'
        return response