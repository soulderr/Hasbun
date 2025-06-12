import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchCarrito,
  actualizarCantidadThunk,
  eliminarItemThunk,
} from '../store/slice/carritoSlice';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { RootState } from '../store';

interface ProductoInvitado {
  idProducto: string;
  nombreProducto: string;
  imagen?: string | null;
  precio: number;
  cantidad: number;
}

const Carrito: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, loading } = useAppSelector((state: RootState) => state.carrito);
  console.log('🛒 Items autenticado:', items);
  const [carritoInvitado, setCarritoInvitado] = useState<ProductoInvitado[]>([]);
  const isAuthenticated = Boolean(localStorage.getItem('access'));

  useEffect(() => {
    const cargarCarrito = () => {
      if (isAuthenticated) {
        dispatch(fetchCarrito());
      } else {
        const localCarrito = localStorage.getItem('carrito');
        setCarritoInvitado(localCarrito ? JSON.parse(localCarrito) : []);
      }
    };

    cargarCarrito();
    window.addEventListener('carritoActualizado', cargarCarrito);

    return () => {
      window.removeEventListener('carritoActualizado', cargarCarrito);
    };
  }, [dispatch, isAuthenticated]);

  const actualizarCantidad = (id: number, cantidad: number) => {
    dispatch(actualizarCantidadThunk({ id, cantidad }));
  };

  const eliminarItem = (id: number) => {
    dispatch(eliminarItemThunk(id));
  };

  const actualizarCantidadInvitado = (idProducto: string, cantidad: number) => {
    const nuevoCarrito = carritoInvitado.map(item =>
      item.idProducto === idProducto ? { ...item, cantidad } : item
    );
    setCarritoInvitado(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const eliminarItemInvitado = (idProducto: string) => {
    const nuevoCarrito = carritoInvitado.filter(item => item.idProducto !== idProducto);
    setCarritoInvitado(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const calcularTotalInvitado = () => {
    return carritoInvitado.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  return (
    <div className="container mt-4">
      <h2>Carrito de Compras</h2>

      {loading && isAuthenticated && <p>Cargando carrito...</p>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Id Producto</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isAuthenticated
            ? items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.producto }
                  </td>
                  <td>{item.producto_detalle?.nombreProducto || 'Sin nombre'}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={e =>
                        actualizarCantidad(item.id, parseInt(e.target.value))
                      }
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>${parseFloat(item.precio_unitario.toString()).toLocaleString('es-CL')}</td>
                  <td>
                    $
                    {(
                      item.cantidad * parseFloat(item.precio_unitario.toString())
                    ).toLocaleString('es-CL')}
                  </td>
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
              ))
            : carritoInvitado.map(item => (
                <tr key={item.idProducto}>
                  <td>
                    <img
                      src={
                        item.imagen ??
                        `https://via.placeholder.com/100x100?text=Producto`
                      }
                      alt={item.nombreProducto}
                      width="60"
                    />
                  </td>
                  <td>{item.nombreProducto}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={e =>
                        actualizarCantidadInvitado(
                          item.idProducto,
                          parseInt(e.target.value)
                        )
                      }
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>${item.precio.toLocaleString('es-CL')}</td>
                  <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarItemInvitado(item.idProducto)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>

      <div className="text-end">
        <h4>
          Total:{' '}
          <span className="text-success">
            $
            {isAuthenticated
              ? total.toLocaleString('es-CL')
              : calcularTotalInvitado().toLocaleString('es-CL')}
          </span>
        </h4>
        <Button variant="danger"size="lg" className="mt-2">Proceder al pago</Button>
      </div>
    </div>
  );
};

export default Carrito;
