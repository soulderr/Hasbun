import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductoDetalle.css';

interface ApiProduct {
  idProducto: string;
  nombreProducto: string;
  imagen: string | null;
  precioProducto: string | null;
  precioNeto: string;
  stock: number;
  descripcion: string;
  id_categoria: number;
}

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const accessToken = localStorage.getItem('accessToken');
  const carritoId = localStorage.getItem('carritoId');

  const item = {
  producto: product.idProducto,
  cantidad: 1,
  precio_unitario: parseFloat(product.precioNeto),
};

  console.log("🟨 Item a enviar:", item);
  
  if (accessToken ) {
    try {
      const response = await fetch('http://127.0.0.1:8000/carrito/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔴 Error del backend:', errorData);
        throw new Error(JSON.stringify(errorData));
      }

      window.dispatchEvent(new Event('carritoActualizado'));
      alert('Producto agregado al carrito (usuario autenticado)');
    } catch (error) {
      console.error('❌ Error al agregar al carrito autenticado:', error);
      alert('No se pudo agregar el producto al carrito (autenticado)');
    }

  } else {
    // Usuario invitado
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const indiceExistente = carrito.findIndex(
      (p: any) => p.idProducto === product.idProducto
    );

    if (indiceExistente !== -1) {
      carrito[indiceExistente].cantidad += 1;
    } else {
      carrito.push({
        idProducto: product.idProducto,
        nombreProducto: product.nombreProducto,
        imagen: product.imagen,
        precio: parseFloat(product.precioNeto),
        cantidad: 1,
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('carritoActualizado'));
    alert('Producto agregado al carrito (sin sesión)');
  }
};



  if (loading) {
    return <div className="producto-detalle"><p>Cargando detalles del producto...</p></div>;
  }

  if (error) {
    return <div className="producto-detalle"><p>Error: {error}</p></div>;
  }

  if (!product) {
    return <div className="producto-detalle"><p>Producto no encontrado.</p></div>;
  }

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
        <button className="btn btn-outline-danger" onClick={agregarAlCarrito}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg> Agregar al carrito
        </button>
        <button className="btn btn-outline-danger">Comprar</button>
        <button className="btn btn-outline-danger">Descargar ficha técnica</button>
      </div>
    </div>
  );
};

export default ProductoDetalle;
