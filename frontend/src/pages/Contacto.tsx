import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Contacto.css';
import api from './axiosConfig'; // Asegúrate de ajustar esta ruta si es distinta

const Contacto: React.FC = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const [mensajeEnviado, setMensajeEnviado] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensajeEnviado('');

    if (!formulario.nombre || !formulario.email || !formulario.mensaje) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      await api.post('contacto/enviar/', formulario);
      setMensajeEnviado('✅ Mensaje enviado correctamente');
      setFormulario({ nombre: '', email: '', mensaje: '' });

      setTimeout(() => {
        setMensajeEnviado('');
      }, 3000);
    } catch (err) {
      setError('❌ Error al enviar el mensaje. Intenta nuevamente.');
      console.error(err);
    }
  };

  return (
    <div className="contacto-wrapper">
      <h1 className="titulo">Contacto</h1>
      <Form onSubmit={handleSubmit} className="formulario-contacto">
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            className="input-dark"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formulario.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
            className="input-dark"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="mensaje"
            value={formulario.mensaje}
            onChange={handleChange}
            placeholder="Escribe tu mensaje"
            className="input-dark"
            required
          />
        </Form.Group>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {mensajeEnviado && <div style={{ color: 'green', marginBottom: '10px' }}>{mensajeEnviado}</div>}

        <Button variant="danger" type="submit">
          Enviar
        </Button>
      </Form>
    </div>
  );
};

export default Contacto;
