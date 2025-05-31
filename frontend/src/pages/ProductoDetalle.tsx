import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductoDetalle.css';

// Interfaz para el producto que esperamos de la API
interface ApiProduct {
  idProducto: string;
  nombreProducto: string;
  imagen: string | null;
  precioProducto: string | null; // O considera number si tu API lo devuelve como número
  precioNeto: string; // O considera number
  stock: number;
  descripcion: string;
  peso: string; // O considera number
  id_categoria: number;
  // id_detalleVenta: any; // O el tipo correcto si lo usas
  // id_carrito: any;    // O el tipo correcto si lo usas
}

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtiene el 'idProducto' de la URL
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
        // Asegúrate de que la URL de la API sea correcta
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
  }, [id]); // El efecto se ejecuta cuando el 'id' de la URL cambia

  if (loading) {
    return <div className="producto-detalle"><p>Cargando detalles del producto...</p></div>;
  }

  if (error) {
    return <div className="producto-detalle"><p>Error: {error}</p></div>;
  }

  if (!product) {
    return <div className="producto-detalle"><p>Producto no encontrado.</p></div>;
  }

  // Formatear precioNeto para mostrarlo con separador de miles si es necesario
  const formatPrice = (priceString: string | null) => {
    if (!priceString) return 'No disponible';
    const priceNumber = parseFloat(priceString);
    if (isNaN(priceNumber)) return 'Precio inválido';
    return priceNumber.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
        <p><strong>Peso:</strong> {product.peso || 'No especificado'} kg</p>
        <p><strong>Categoría ID:</strong> {product.id_categoria}</p>
        {/* Puedes añadir más detalles si los tienes */}
      </div>
      
      <div className="acciones-producto">
        <button className="btn btn-outline-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg> Agregar al carrito
        </button>
        <button className="btn btn-outline-danger">Comprar</button>
        <button className="btn btn-outline-danger">Descargar ficha tecnica</button>
      </div>
    </div>
  );
};

export default ProductoDetalle;