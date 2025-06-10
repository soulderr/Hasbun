import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

interface ProductoDetalle {
  idProducto: string;
  nombreProducto: string;
  imagen?: string;
}

interface Item {
  id: number;
  producto: string;
  producto_detalle?: ProductoDetalle;
  cantidad: number;
  precio_unitario: string;
}

const Carrito: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const cargarCarrito = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const response = await axios.get('http://127.0.0.1:8000/carrito/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data[0]?.items || []);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    }
  };

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    const nuevaLista = [...items];
    nuevaLista[index].cantidad = nuevaCantidad;

    // Aquí puedes agregar un fetch PUT si el usuario está logeado
    setItems(nuevaLista);
  };

  const eliminarItem = async (itemId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/carrito/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      cargarCarrito();
    } catch (error) {
      console.error('Error al eliminar item del carrito:', error);
    }
  };

  useEffect(() => {
    cargarCarrito();
    window.addEventListener('carritoActualizado', cargarCarrito);
    return () => window.removeEventListener('carritoActualizado', cargarCarrito);
  }, []);

  const calcularSubtotal = (item: Item) => {
    return parseFloat(item.precio_unitario) * item.cantidad;
  };

  const totalCompra = items.reduce((acc, item) => acc + calcularSubtotal(item), 0);

  return (
    <div className="container mt-4">
      <h2>🛒 Carrito de Compras</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Nombre</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{item.producto_detalle?.idProducto || item.producto}</td>
              <td>{item.producto_detalle?.nombreProducto || 'Producto'}</td>
              <td>${parseFloat(item.precio_unitario).toLocaleString()}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) =>
                    actualizarCantidad(index, parseInt(e.target.value))
                  }
                  style={{ width: '70px' }}
                />
              </td>
              <td>${calcularSubtotal(item).toLocaleString()}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarItem(item.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-end">
        <h4>Total: ${totalCompra.toLocaleString()}</h4>
        <Button variant="danger" className="mt-2">Proceder al pago</Button>
      </div>
    </div>
  );
};

export default Carrito;
