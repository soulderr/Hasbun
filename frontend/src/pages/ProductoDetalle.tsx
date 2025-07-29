import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductoDetalle.css';

interface FichaTecnica {
  id: number;
  nombre: string;
  archivo_pdf: string;
}

interface ApiProduct {
  idProducto: string;
  nombreProducto: string;
  imagen: string | null;
  precioProducto: string | null;
  precioNeto: string;
  stock: number;
  descripcion: string;
  id_categoria: number;
  ficha_tecnica?: FichaTecnica | null;  
}

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [carritoAuth, setCarritoAuth] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError("ID de producto no encontrado en la URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/producto/${id}/`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Producto con ID ${id} no encontrado.`);
          }
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data: ApiProduct = await response.json();
        setProduct(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido al cargar los detalles del producto.');
        }
        console.error("Error al obtener detalles del producto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) return;

    const fetchCarrito = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/carrito/items/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCarritoAuth(data); // Guarda los productos actuales
        }
      } catch (err) {
        console.error('Error al cargar carrito del usuario:', err);
      }
    };

    fetchCarrito();
  }, []);

  const formatPrice = (priceString: string | null) => {
    if (!priceString) return 'No disponible';
    const priceNumber = parseFloat(priceString);
    if (isNaN(priceNumber)) return 'Precio inválido';
    return priceNumber.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  
  const agregarAlCarrito = async () => {
    if (!product) return;

    const access = localStorage.getItem('access');

    const item = {
      producto: product.idProducto,
      cantidad: 1,
      precio_unitario: parseFloat(product.precioNeto),
    };

    console.log("🟨 Item a enviar:", item);

    // ✅ Modo autenticado
    if (access) {
      // ✅ Verifica si ya tiene el producto en el carrito
      const existente = carritoAuth.find((item: any) => item.producto === product.idProducto);
      const cantidadActual = existente?.cantidad || 0;

      if (cantidadActual >= product.stock) {
        alert(`Ya tienes el máximo disponible (${product.stock}) en el carrito.`);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/carrito/items/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('🔴 Error del backend:', errorData);
          alert(errorData.detail || 'Error al agregar al carrito (autenticado)');
          return;
        }

        // ✅ Actualiza carrito local del autenticado
        const nuevoItem = await response.json();
        setCarritoAuth(prev => {
          const yaExiste = prev.find(p => p.producto === nuevoItem.producto);
          if (yaExiste) {
            return prev.map(p =>
              p.producto === nuevoItem.producto ? { ...p, cantidad: nuevoItem.cantidad } : p
            );
          } else {
            return [...prev, nuevoItem];
          }
        });

        window.dispatchEvent(new Event('carritoActualizado'));
        alert('Producto agregado al carrito (usuario autenticado)');
      } catch (error) {
        console.error('❌ Error al agregar al carrito autenticado:', error);
        alert('No se pudo agregar el producto al carrito (autenticado)');
      }
    // ✅ Modo invitado
    } else {
      const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

      const indiceExistente = carrito.findIndex(
        (p: any) => p.idProducto === product.idProducto
      );

      if (indiceExistente !== -1) {
        // 🛑 Validación de stock
        if (carrito[indiceExistente].cantidad >= product.stock) {
          alert(`Ya tienes el máximo disponible (${product.stock}) en el carrito.`);
          return;
        }

        carrito[indiceExistente].cantidad += 1;
      } else {
        carrito.push({
          idProducto: product.idProducto,
          nombreProducto: product.nombreProducto,
          imagen: product.imagen,
          precio: parseFloat(product.precioNeto),
          cantidad: 1,
          stock: product.stock, // ✅ stock incluido
        });
      }

      localStorage.setItem('carrito', JSON.stringify(carrito));
      window.dispatchEvent(new Event('carritoActualizado'));
      alert('Producto agregado al carrito (sin sesión)');
    }
  };


  console.log(product)

  if (loading) {
    return <div className="producto-detalle"><p>Cargando detalles del producto...</p></div>;
  }

  if (error) {
    return <div className="producto-detalle"><p>Error: {error}</p></div>;
  }

  if (!product) {
    return <div className="producto-detalle"><p>Producto no encontrado.</p></div>;
  }

  const descargarFichaTecnica = () => {
    const nombreArchivo = product?.ficha_tecnica?.archivo_pdf?.split('/').pop();

    if (!nombreArchivo) {
      alert('Este producto no tiene ficha técnica disponible.');
      return;
    }

    const url = `http://127.0.0.1:8000/fichatecnica/descargar-pdf/${nombreArchivo}`;


    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreArchivo); // nombre del archivo original
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="producto-detalle">
      <h2>{product.nombreProducto}</h2>
      <img 
        src={product.imagen || `https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=${encodeURIComponent(product.nombreProducto)}`} 
        alt={product.nombreProducto} 
        className="producto-imagen" 
      />
      <p className="descripcion-producto">{product.descripcion || 'Descripción no disponible.'}</p>
      <div className="detalles-adicionales">
        <p><strong>ID Producto:</strong> {product.idProducto}</p>
        <p><strong>Precio Neto:</strong> {formatPrice(product.precioNeto)}</p>
        <p><strong>Stock disponible:</strong> {product.stock} unidades</p>
        <p><strong>Categoría ID:</strong> {product.id_categoria}</p>
      </div>
    
      <div className="acciones-producto">
        <button
          className="btn btn-outline-danger"
          onClick={agregarAlCarrito}
          disabled={product.stock === 0} // ✅ desactiva si stock es 0
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg> Agregar al carrito
        </button>

        <button className="btn btn-outline-danger" onClick={descargarFichaTecnica}>
          Descargar ficha técnica
        </button>
      </div>
    </div>
  );
};

export default ProductoDetalle;
