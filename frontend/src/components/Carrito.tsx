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
  stock: number;
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
        const carrito = localCarrito ? JSON.parse(localCarrito) : [];

        // 🔧 Corregir cantidades inválidas
        const carritoCorregido = carrito.map((item: ProductoInvitado) => ({
          ...item,
          cantidad:
            typeof item.cantidad === 'number' && !isNaN(item.cantidad) && item.cantidad > 0
              ? item.cantidad
              : 1,
          stock:
            typeof item.stock === 'number' && !isNaN(item.stock) && item.stock > 0
              ? item.stock
              : 9999, // ⚠️ fallback solo si no viene stock
        }));

        setCarritoInvitado(carritoCorregido);
      }
    };

    cargarCarrito();
    window.addEventListener('carritoActualizado', cargarCarrito);
    return () => window.removeEventListener('carritoActualizado', cargarCarrito);
  }, [dispatch, isAuthenticated]);


  const actualizarCantidad = (id: number, cantidad: number) => {
    if (isNaN(cantidad) || cantidad < 1) return;
    dispatch(actualizarCantidadThunk({ id, cantidad }));
  };

  const eliminarItem = (id: number) => {
    dispatch(eliminarItemThunk(id));
  };

  const actualizarCantidadInvitado = (idProducto: string, nuevaCantidad: number) => {
    const nuevoCarrito = carritoInvitado.map(item => {
      if (item.idProducto === idProducto) {
        const cantidadMaxima = item.stock ?? 9999;

        if (nuevaCantidad > cantidadMaxima) {
          alert(`⚠️ Solo hay ${cantidadMaxima} unidades disponibles de "${item.nombreProducto}".`);
        }

        const cantidadValida = Math.min(nuevaCantidad, cantidadMaxima);

        return { ...item, cantidad: cantidadValida };
      }
      return item;
    });

    setCarritoInvitado([...nuevoCarrito]);
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

  const [correoInvitado, setCorreoInvitado] = useState("");
  const [nombreInvitado, setNombreInvitado] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const iniciarPago = async () => {
    try {
      const token = localStorage.getItem("access");
      const rol = localStorage.getItem("rol");
      const usuario_id = localStorage.getItem("usuario_id");

      let productos;

      if (rol === "0") {
        productos = items.map(item => ({
          id_producto: item.producto,
          cantidad: item.cantidad,
        }));
      } else {
        productos = carritoInvitado.map(item => ({
          id_producto: item.idProducto,
          cantidad: item.cantidad,
        }));

        if (!correoInvitado || !nombreInvitado) {
          alert("Por favor completa tus datos.");
          return;
        }
      }
  
      const response = await fetch("http://localhost:8000/venta/iniciar-pago/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(rol === "0" && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          usuario_id: rol === "0" ? usuario_id : null,
          productos,
          invitado: rol !== "0",
          correo: correoInvitado,
          nombre: nombreInvitado,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Error en la respuesta:", text);
        alert("Error al iniciar el pago. Revisa consola para más detalles.");
        return;
      }

      const data = await response.json();
      if (data.url && data.token) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.url;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = data.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Error al iniciar el pago");
      }
    } catch (error) {
      console.error("Error al iniciar pago:", error);
      alert("Hubo un error al intentar pagar.");
    }
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
                      max={item.producto_detalle?.stock}
                      value={item.cantidad}
                      onChange={e => {
                        const valor = parseInt(e.target.value);
                        if (!isNaN(valor)) {
                          actualizarCantidad(item.id, valor);
                        }
                      }}
                      disabled={item.producto_detalle?.stock === 0}
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
                      max={item.stock}
                      value={item.cantidad}
                      onChange={e => {
                        const valor = parseInt(e.target.value);
                        if (!isNaN(valor)) {
                          actualizarCantidadInvitado(item.idProducto, valor);
                        }
                      }}
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
        <Button variant="danger"size="lg"className="mt-2"onClick={() => {
            if (isAuthenticated) {
              iniciarPago();
            } else {
              setMostrarFormulario(true);
            }
          }}
        >
          Proceder al pago
        </Button>
        {!isAuthenticated && mostrarFormulario && (
          <div className="mt-3">
            <h5>Ingresa tus datos para continuar con el pago:</h5>
            <Form>
              <Form.Group controlId="correoInvitado" className="mb-2">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={correoInvitado}
                  onChange={(e) => setCorreoInvitado(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="nombreInvitado" className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombreInvitado}
                  onChange={(e) => setNombreInvitado(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="success" onClick={iniciarPago}>
                Confirmar y Pagar
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
