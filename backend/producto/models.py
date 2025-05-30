from django.db import models

# Create your models here.

class Producto(models.Model):
    idProducto = models.CharField(primary_key=True, max_length=20)  # Cambiado a CharField para permitir valores como '1000-001'
    id_categoria = models.ForeignKey('categoria.Categoria', on_delete=models.PROTECT, null=True, blank=True, db_column='id_categoria')
    id_detalleVenta = models.ForeignKey('detalleVenta.DetalleVenta', on_delete=models.PROTECT, null=True, blank=True, db_column='id_detalleVenta')
    id_carrito = models.ForeignKey('carrito.Carrito', on_delete=models.PROTECT, null=True, blank=True, db_column='id_carrito')
    nombreProducto = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    precioProducto = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    precioNeto = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    descripcion = models.TextField()
    peso = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.idProducto}{self.nombreProducto} {self.precioProducto} {self.stock} {self.descripcion} "
        