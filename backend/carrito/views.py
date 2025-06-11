from rest_framework import generics
from .models import Carrito, ItemCarrito
from .serializers import CarritoSerializer, ItemCarritoSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateDestroyAPIView

class CarritoListCreateView(generics.ListCreateAPIView):
    serializer_class = CarritoSerializer

    def get_queryset(self):
        return Carrito.objects.filter(usuario=self.request.user)



class ItemCarritoListCreateView(generics.ListCreateAPIView):
    serializer_class = ItemCarritoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ItemCarrito.objects.filter(carrito__usuario=self.request.user)

    def perform_create(self, serializer):
        usuario = self.request.user

        # Verificar si ya tiene un carrito
        carrito, creado = Carrito.objects.get_or_create(usuario=usuario)

        producto = serializer.validated_data['producto']
        cantidad = serializer.validated_data['cantidad']
        precio_unitario = serializer.validated_data['precio_unitario']

        # Verificar si ya existe ese producto en el carrito
        item_existente = ItemCarrito.objects.filter(carrito=carrito, producto=producto).first()

        if item_existente:
            # Si ya existe, aumentar la cantidad
            item_existente.cantidad += cantidad
            item_existente.save()
        else:
            # Si no, crear uno nuevo
            serializer.save(carrito=carrito)

class ItemCarritoListView(generics.ListAPIView):
    serializer_class = ItemCarritoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        carrito, creado = Carrito.objects.get_or_create(usuario=self.request.user)
        return ItemCarrito.objects.filter(carrito=carrito)

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

class ItemCarritoDetalleView(RetrieveUpdateDestroyAPIView):
    queryset = ItemCarrito.objects.all()
    serializer_class = ItemCarritoSerializer
    permission_classes = [IsAuthenticated]