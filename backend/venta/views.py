from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404, redirect
from transbank.webpay.webpay_plus.transaction import Transaction, WebpayOptions
from transbank.common.integration_commerce_codes import IntegrationCommerceCodes
from transbank.common.integration_api_keys import IntegrationApiKeys
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from venta.models import Venta
from detalleVenta.models import DetalleVenta
from producto.models import Producto
from usuarios.models import Usuario
import os 
from dotenv import load_dotenv  
load_dotenv()  

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
    
        usuario = None
        if usuario_id:
            usuario = get_object_or_404(Usuario, id=usuario_id)
        else:
            # Puedes usar un "Usuario Invitado" predefinido o dejarlo como null
            usuario = Usuario.objects.get(email="invitado@correo.com")  # opcional
        if usuario_id and (not usuario.first_name or not usuario.last_name or not usuario.email):
            return Response({
                'error': 'Por favor completa tus datos (nombre, apellido y correo electrónico) antes de continuar con el pago.'
            }, status=400)
        # Código único para la transacción
        orden_compra = str(uuid.uuid4())[:12]

        # Crear venta con estado pendiente
        venta = Venta.objects.create(
            id_usuario=usuario,
            total=0,  # se actualizará
            estado="pendiente",
            orden_compra=orden_compra
        )

        total = 0
        for item in productos:
            producto = get_object_or_404(Producto, idProducto=item["id_producto"])
            cantidad = item["cantidad"]
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

        venta.total = total
        venta.save()

        return_url = os.getenv("RETURN_URL")

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
    if request.method == 'POST':
        token = request.POST.get('token_ws')

        try:
            tx = Transaction()
            response = tx.commit(token)

            orden = response.get('buy_order')
            status = response.get('status')  # "AUTHORIZED", etc.

            venta = Venta.objects.get(orden_compra=orden)
            venta.estado = 'pagado' if status == 'AUTHORIZED' else 'fallido'
            venta.save()

            if status == 'AUTHORIZED':
                return redirect(f'http://localhost:5173/pago-exitoso?orden={orden}')
            else:
                return redirect('http://localhost:5173/pago-fallido')

        except Exception as e:
            print(f"Error al confirmar transacción: {e}")
            return redirect('http://localhost:5173/pago-fallido')
    else:
        return HttpResponse("Método no permitido", status=405)
    
@api_view(['GET'])
def detalle_venta(request):
    orden = request.GET.get('orden')

    try:
        venta = Venta.objects.get(orden_compra=orden)
        detalles = venta.detalles.all()  # gracias a related_name='detalles'

        data = {
            'idVenta': venta.idVenta,
            'usuario': venta.id_usuario.email,
            'fecha': venta.fecha_venta,
            'total': venta.total,
            'estado': venta.estado,
            'productos': [
                {
                    'nombre': d.id_producto.nombreProducto,
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
    
