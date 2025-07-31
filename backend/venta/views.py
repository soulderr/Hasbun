from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404, redirect, render
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.options import WebpayOptions
from transbank.common.integration_type import IntegrationType
from transbank.common.integration_commerce_codes import IntegrationCommerceCodes
from transbank.common.integration_api_keys import IntegrationApiKeys
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseBadRequest
from xhtml2pdf import pisa
from django.template.loader import get_template, render_to_string
from django.http import HttpResponse
from venta.models import Venta
from detalleVenta.models import DetalleVenta
from producto.models import Producto
from usuarios.models import Usuario
import os 
import base64
from io import BytesIO
from dotenv import load_dotenv  
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
load_dotenv()  

def obtener_logo_base64():
    ruta_logo = os.path.join(settings.STATIC_ROOT, 'img', 'logo.png')
    if not os.path.exists(ruta_logo):
        print(f"⚠️ No se encontró el logo en {ruta_logo}")
        return ''
    with open(ruta_logo, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

def generar_pdf_venta(venta):
    template = get_template('venta/pdf_venta.html')

    # Codificar logo como base64
    logo_path = os.path.join(settings.BASE_DIR, 'static', 'logo.png')
    with open(logo_path, "rb") as image_file:
        logo_base64 = base64.b64encode(image_file.read()).decode('utf-8')

    html = template.render({
        'venta': venta,
        'logo_base64': logo_base64,
    })

    output_path = os.path.join(settings.MEDIA_ROOT, f'ventas/venta_{venta.orden_compra}.pdf')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "wb") as f:
        pisa.CreatePDF(html, dest=f)

    with open(output_path, "rb") as f:
        response = HttpResponse(f.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="venta_{venta.orden_compra}.pdf"'
        return response

def obtener_webpay_options():
    tipo = os.getenv("TRANSBANK_ENV", "TEST")
    integration_type = "LIVE" if tipo == "LIVE" else "TEST"
    print("🧪 ENV:", os.getenv("TRANSBANK_COMMERCE_CODE"), os.getenv("TRANSBANK_API_KEY"), integration_type)

    return WebpayOptions(
        commerce_code=os.getenv("TRANSBANK_COMMERCE_CODE"),
        api_key=os.getenv("TRANSBANK_API_KEY"),
        integration_type=integration_type
    )

class IniciarPagoView(APIView):
    def post(self, request):
        data = request.data
        usuario_id = data.get("usuario_id")
        productos = data.get("productos", [])
        invitado = data.get("invitado", False)

        # Buscar usuario
        if usuario_id:
            usuario = get_object_or_404(Usuario, id=usuario_id)
        else:
            usuario = Usuario.objects.get(email="invitado@correo.com")  # Usuario invitado por defecto

        # Validar datos de usuario si no es invitado
        if usuario_id and (not usuario.first_name or not usuario.last_name or not usuario.email):
            return Response({
                'error': 'Por favor completa tus datos (nombre, apellido y correo electrónico) antes de continuar con el pago.'
            }, status=400)

        # Código único de orden
        orden_compra = str(uuid.uuid4())[:12]

        # Crear venta
        venta = Venta.objects.create(
            id_usuario=usuario,
            total=0,
            estado="pendiente",
            orden_compra=orden_compra
        )

        total = 0
        for item in productos:
            producto = get_object_or_404(Producto, idProducto=item["id_producto"])
            cantidad = item["cantidad"]

            # Validar stock antes de iniciar pago
            if cantidad > producto.stock:
                return Response({
                    "error": f"Solo hay {producto.stock} unidades disponibles de {producto.nombreProducto}."
                }, status=400)

            precio_unitario = producto.precioNeto
            subtotal = cantidad * precio_unitario
            total += subtotal

            DetalleVenta.objects.create(
                id_venta=venta,
                id_producto=producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                subtotal=subtotal
            )

        # Actualizar total
        venta.total = total
        venta.save()

        return_url = os.getenv("RETURN_URL")

        # Iniciar transacción en Webpay
        tx = Transaction(obtener_webpay_options())
        response = tx.create(orden_compra, str(usuario.id), total, return_url)

        venta.token_webpay = response["token"]
        venta.save()

        return Response({
            "url": response["url"],
            "token": response["token"]
        })



@csrf_exempt
def confirmar_transaccion(request):
    token_ws = request.GET.get("token_ws")
    if not token_ws:
        return redirect("http://localhost:5173/pago-fallido")

    try:
        # ✅ Consultar a Transbank el resultado real
        tx = Transaction(obtener_webpay_options())
        response = tx.commit(token_ws)
        print("🔄 Resultado Transacción:", response)
    except Exception as e:
        print(f"❌ Error en commit: {e}")
        return redirect("http://localhost:5173/pago-fallido")

    try:
        venta = Venta.objects.get(orden_compra=response['buy_order'])
    except Venta.DoesNotExist:
        return redirect("http://localhost:5173/pago-fallido")

    if response['status'] == 'AUTHORIZED':
        venta.estado = 'pagado'
        venta.save()

        # 🔹 Descontar stock
        for detalle in venta.detalles.all():
            producto = detalle.id_producto
            if producto.stock >= detalle.cantidad:
                producto.stock -= detalle.cantidad
                producto.save()
            else:
                print(f"⚠️ Stock insuficiente para {producto.nombreProducto}")

        # Generar PDF
        generar_pdf_venta(venta)

        return redirect(f"http://localhost:5173/pago-exitoso?orden={venta.orden_compra}")
    else:
        venta.estado = 'fallido'
        venta.save()
        return redirect("http://localhost:5173/pago-fallido")

    
@api_view(['GET'])
def detalle_venta(request):
    orden = request.GET.get('orden')

    try:
        venta = Venta.objects.get(orden_compra=orden)
        detalles = venta.detalles.all()

        data = {
            'idVenta': venta.idVenta,
            'usuario': venta.id_usuario.email,
            'fecha': venta.fecha_venta,
            'total': venta.total,
            'estado': venta.estado,
            'productos': [
                {
                    'nombre': d.id_producto.nombreProducto if d.id_producto else "N/D",
                    'cantidad': d.cantidad,
                    'precio_unitario': float(d.precio_unitario),
                    'subtotal': float(d.subtotal),
                }
                for d in detalles
            ]
        }

        return Response(data)
    except Venta.DoesNotExist:
        return Response({'error': 'Venta no encontrada'}, status=404)

@api_view(['POST'])
def reintentar_pago(request):
    orden = request.data.get('orden')

    try:
        venta = Venta.objects.get(orden_compra=orden)

        if venta.estado != 'fallido':
            return Response({'error': 'La venta no está en estado fallido'}, status=400)

        # Generar nueva transacción con el mismo monto
        tx = Transaction(obtener_webpay_options())

        return_url = os.getenv("RETURN_URL")
        response = tx.create(venta.orden_compra, str(venta.id_usuario.id), venta.total, return_url)

        venta.token_webpay = response["token"]
        venta.save()

        return Response({
            "url": response["url"],
            "token": response["token"]
        })

    except Venta.DoesNotExist:
        return Response({'error': 'Venta no encontrada'}, status=404)
    

class CustomPagination(PageNumberPagination):
    page_size = 5  # Solo 5 por página
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historial_compras(request):
    usuario = request.user
    ventas = Venta.objects.filter(id_usuario=usuario, estado='pagado').order_by('-fecha_venta')

    paginator = CustomPagination()
    paginated_ventas = paginator.paginate_queryset(ventas, request)

    data = []
    for venta in paginated_ventas:
        generar_pdf_venta(venta)  # ✅ Si no existe, lo crea
        data.append({
            'orden': venta.orden_compra,
            'fecha': venta.fecha_venta,
            'total': float(venta.total),
            'estado': venta.estado,
            'pdf_url': f"http://localhost:8000/media/ventas/venta_{venta.orden_compra}.pdf"
        })

    return paginator.get_paginated_response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def lista_pdfs_ventas(request):
    ventas = Venta.objects.filter(
        estado='pagado'
    ).order_by('-fecha_venta')

    paginator = CustomPagination()
    paginated_ventas = paginator.paginate_queryset(ventas, request)

    data = []
    for venta in paginated_ventas:
        generar_pdf_venta(venta)  # ✅ Genera el PDF si no existe
        data.append({
            "orden": venta.orden_compra,
            "fecha": venta.fecha_venta,
            "pdf_url": f"http://localhost:8000/media/ventas/venta_{venta.orden_compra}.pdf"
        })

    return paginator.get_paginated_response(data)