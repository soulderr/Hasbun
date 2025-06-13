import React, { useEffect, useState } from 'react';
import api from '../pages/axiosConfig';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import './AdminMensajesContacto.css';

interface MensajeContacto {
  id: number;
  nombre: string;
  email: string;
  mensaje: string;
  fecha_envio: string;
}

const AdminMensajesContacto: React.FC = () => {
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [error, setError] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const mensajesPorPagina = 6;

  const cargarMensajes = async () => {
    try {
      const response = await api.get('contacto/mensajes/');
      setMensajes(response.data);
    } catch (err) {
      setError('No se pudieron cargar los mensajes');
      console.error(err);
    }
  };

  const eliminarMensaje = async (id: number) => {
    const confirmar = window.confirm('¿Estás seguro que deseas eliminar este mensaje?');
    if (!confirmar) return;

    try {
      await api.delete(`contacto/mensajes/${id}/`);
      setMensajes(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError('No se pudo eliminar el mensaje');
      console.error(err);
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  // Paginación
  const indexUltimo = paginaActual * mensajesPorPagina;
  const indexPrimero = indexUltimo - mensajesPorPagina;
  const mensajesActuales = mensajes.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(mensajes.length / mensajesPorPagina);

  return (
    <div className="admin-contacto container mt-4">
      <h2 className="text-center mb-4">Mensajes de Contacto</h2>
      {error && <div className="text-danger text-center mb-3">{error}</div>}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ color: '#000' }}>Nombre</th>
              <th style={{ color: '#000' }}>Email</th>
              <th style={{ color: '#000' }}>Mensaje</th>
              <th style={{ color: '#000' }}>Fecha</th>
              <th style={{ color: '#000' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mensajesActuales.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.nombre}</td>
                <td>{msg.email}</td>
                <td>{msg.mensaje}</td>
                <td>{new Date(msg.fecha_envio).toLocaleString()}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="py-0 px-2"
                    style={{ fontSize: '0.75rem', lineHeight: '1.2' }}
                    onClick={() => eliminarMensaje(msg.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPaginas)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === paginaActual}
              onClick={() => setPaginaActual(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export default AdminMensajesContacto;
