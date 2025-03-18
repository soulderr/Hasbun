import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ProductoDetalle.css';

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { name, description, image } = location.state as { name: string, description: string, image: string };

  // Aquí puedes obtener los detalles del producto usando el id
  // Por simplicidad, usaremos datos estáticos
  const product = {
    id,
    name,
    description,
    image: image || 'https://via.placeholder.com/200', // Usar la URL de la imagen pasada desde el estado
    quantity: 10,
    precio: 1000
  };

  return (
    <div className="producto-detalle">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} className="producto-imagen" />
      <p>{product.description}</p>
      <p>Cantidad disponible: {product.quantity}</p>
      <p>Precio: {product.precio}</p>
      <button className="btn btn-outline-danger">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
        </svg> Agregar al carrito
      </button>
      <p></p>
      <button className="btn btn-outline-danger">Comprar</button>
      <p></p>
      <button className="btn btn-outline-danger">Descargar ficha tecnica</button>
    </div>
  );
};

export default ProductoDetalle;