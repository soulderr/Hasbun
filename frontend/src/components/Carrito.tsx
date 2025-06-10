import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

interface Item {
  id: number;
  producto_detalle: {
    idProducto: string;
    nombreProducto: string;
    imagen?: string;
  };
  cantidad: number;
  precio_unitario: string;
}

function Carrito() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState<number>(0);

  const fetchCarrito = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await axios.get('http://127.0.0.1:8000/carrito/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const carrito = response.data[0];
      setItems(carrito?.items || []);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    }
  };

  useEffect(() => {
    fetchCarrito();
    window.addEventListener('carritoActualizado', fetchCarrito);
    return () => {
      window.removeEventListener('carritoActualizado', fetchCarrito);
    };
  }, []);

  useEffect(() => {
    const totalCalculado = items.reduce((acc, item) => acc + item.cantidad * parseFloat(item.precio_unitario), 0);
    setTotal(totalCalculado);
  }, [items]);

 const actualizarCantidad = async (id: number, nuevaCantidad: number) => {
  const token = localStorage.getItem('accessToken');
  const item = items.find(i => i.id === id);
  if (!item || !token) return;

  try {
    await axios.put(
      `http://127.0.0.1:8000/carrito/items/${id}/`,
      {
        carrito: localStorage.getItem('carritoId'), // ✅ incluye el ID del carrito
        producto: item.producto_detalle.idProducto,
        cantidad: nuevaCantidad,
        precio_unitario: item.precio_unitario,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const nuevosItems = items.map(i =>
      i.id === id ? { ...i, cantidad: nuevaCantidad } : i
    );
    setItems(nuevosItems);
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    if (axios.isAxiosError(error)) {
      console.error('Detalle del error del backend:', error.response?.data);
    }
  }
};
  const eliminarItem = async (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/carrito/items/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-danger mb-4">Carrito de Compras</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.producto_detalle?.idProducto}</td>
              <td>{item.producto_detalle?.nombreProducto}</td>
              <td>${parseFloat(item.precio_unitario).toLocaleString()}</td>
              <td style={{ maxWidth: '100px' }}>
                <Form.Control
                  type="number"
                  min={1}
                  value={item.cantidad}
                  onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value))}
                />
              </td>
              <td>
                {(item.cantidad * parseFloat(item.precio_unitario)).toLocaleString('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                })}
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => eliminarItem(item.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-end">
        <h4>Total: {total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</h4>
        <Button variant="danger"size="lg" className="mt-2">Proceder al pago</Button>
      </div>
    </div>
    
  );
}

export default Carrito;