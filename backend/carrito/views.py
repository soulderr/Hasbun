from rest_framework import generics
from .models import Carrito, ItemCarrito
from .serializers import CarritoSerializer, ItemCarritoSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class CarritoListCreateView(generics.ListCreateAPIView):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer


class ItemCarritoListCreateView(generics.ListCreateAPIView):
    queryset = ItemCarrito.objects.all()
    serializer_class = ItemCarritoSerializer

class ItemCarritoListView(generics.ListAPIView):
    serializer_class = ItemCarritoSerializer

    def get_queryset(self):
        carrito_id = self.request.query_params.get('carrito')
        return ItemCarrito.objects.filter(carrito_id=carrito_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        total = sum(item.cantidad * item.precio_unitario for item in queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "items": serializer.data,
            "total": f"{total:.2f}"
        })
    
class ItemCarritoDetailView(generics.RetrieveDestroyAPIView):
    queryset = ItemCarrito.objects.all()
    serializer_class = ItemCarritoSerializer

class VaciarCarritoView(APIView):
    def delete(self, request, carrito_id):
        try:
            carrito = Carrito.objects.get(id=carrito_id)
        except Carrito.DoesNotExist:
            return Response({'error': 'Carrito no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Eliminar todos los items asociados al carrito
        ItemCarrito.objects.filter(carrito=carrito).delete()

        return Response({'mensaje': 'Carrito vaciado exitosamente'}, status=status.HTTP_200_OK)