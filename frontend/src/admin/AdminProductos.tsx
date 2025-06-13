import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Pagination, Modal } from 'react-bootstrap';

interface Producto {
  idProducto: string;
  nombreProducto: string;
  precioNeto: number;
  stock: number;
  descripcion: string;
  id_categoria: any;
}

interface Categoria {
  id_categoria: string;
  nombreCategoria: string;
}

const AdminProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/producto/')
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error al obtener productos:', err));

    axios.get('http://localhost:8000/categoria/')
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error('Error al obtener categorías:', err));
  }, []);

  const eliminarProducto = (id: string) => {
    axios.delete(`http://localhost:8000/producto/${id}/`)
      .then(() => {
        setProductos(prev => prev.filter(p => p.idProducto !== id));
      })
      .catch(err => console.error('Error al eliminar:', err));
  };

  const productosFiltrados = productos.filter(producto => {
    if (!categoriaSeleccionada) return true;
    if (!producto.id_categoria) return false;
    const categoriaId =
        typeof producto.id_categoria === 'object'
        ? producto.id_categoria.id_categoria
        : producto.id_categoria;
    return String(categoriaId) === categoriaSeleccionada;
    });

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosFiltrados.slice(indiceInicio, indiceInicio + productosPorPagina);

  const cambiarPagina = (numero: number) => {
    if (numero >= 1 && numero <= totalPaginas) {
      setPaginaActual(numero);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Panel de Administración - Productos</h2>

      <Form.Group className="mb-3">
        <Form.Label>Filtrar por Categoría</Form.Label>
        <Form.Select
          value={categoriaSeleccionada}
          onChange={(e) => {
            setCategoriaSeleccionada(e.target.value);
            setPaginaActual(1);
          }}
        >
          <option value="">-- Todas las categorías --</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombreCategoria}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPagina.map((producto) => (
              <tr key={producto.idProducto}>
                <td>{producto.idProducto}</td>
                <td>{producto.nombreProducto}</td>
                <td>${producto.precioNeto}</td>
                <td>{producto.stock}</td>
                <td>{producto.descripcion}</td>
                <td>{typeof producto.id_categoria === 'object' ? producto.id_categoria.nombreCategoria : producto.id_categoria}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2">
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setProductoAEliminar(producto);
                      setMostrarModalEliminar(true);
                    }}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
        {[...Array(totalPaginas)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={paginaActual === index + 1}
            onClick={() => cambiarPagina(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
      </Pagination>

      <Modal show={mostrarModalEliminar} onHide={() => setMostrarModalEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar el producto <strong>{productoAEliminar?.nombreProducto}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEliminar(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (productoAEliminar) {
                eliminarProducto(productoAEliminar.idProducto);
                setMostrarModalEliminar(false);
              }
            }}
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProductos;
