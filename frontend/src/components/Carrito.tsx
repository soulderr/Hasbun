import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CarritoItem {
  idProducto: string;
  nombreProducto: string;
  imagen: string | null;
  precio: number;
  cantidad: number;
}

const Carrito: React.FC = () => {
  const [items, setItems] = useState<CarritoItem[]>([]);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setItems(JSON.parse(carritoGuardado));
    }
  }, []);

  const guardarCarrito = (nuevoCarrito: CarritoItem[]) => {
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setItems(nuevoCarrito);
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  const eliminarItem = (idProducto: string) => {
    const actualizado = items.filter(item => item.idProducto !== idProducto);
    guardarCarrito(actualizado);
  };

  const actualizarCantidad = (idProducto: string, nuevaCantidad: number) => {
    const actualizado = items.map(item =>
      item.idProducto === idProducto
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );
    guardarCarrito(actualizado);
  };

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="container mt-4">
      <h2>Carrito de Compras</h2>
      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.idProducto}>
                <td>
                  <img
                    src={item.imagen || `https://via.placeholder.com/100x70/CCCCCC/FFFFFF?text=${item.nombreProducto}`}
                    alt={item.nombreProducto}
                    width={70}
                  />
                </td>
                <td>{item.nombreProducto}</td>
                <td>{item.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                <td>
                  <input
                    type="number"
                    value={item.cantidad}
                    min={1}
                    onChange={(e) => actualizarCantidad(item.idProducto, parseInt(e.target.value))}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>{(item.precio * item.cantidad).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminarItem(item.idProducto)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {items.length > 0 && (
        <div className="text-end">
          <h4>Total: {total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</h4>
          <Link to="/checkout" className="btn btn-danger mt-2">
            Proceder al Pago
          </Link>
        </div>
      )}
    </div>
  );
};

export default Carrito;
