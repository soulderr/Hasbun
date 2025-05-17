from django.db import models

# Create your models here.

class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    id_Producto = models.ForeignKey('producto.Producto', on_delete=models.PROTECT,null=True,blank=True,related_name='categorias')
    nombreCategoria = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)
    idCategoriaPadre = models.ForeignKey('self',on_delete=models.SET_NULL,null=True,blank=True,related_name='subcategorias'
    )

    def __str__(self):
        return f"{self.nombreCategoria} {self.descripcion} {self.idCategoriaPadre}"
        