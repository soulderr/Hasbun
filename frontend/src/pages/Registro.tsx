import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import api from './axiosConfig'; 
import './Registro.css';
const API_URL = 'http://127.0.0.1:8000/registro/';

function Registro() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });


  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await api.post(API_URL, {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      setSuccess('Registro exitoso');
      // Guarda tokens en localStorage
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('rol', response.data.rol);
      localStorage.setItem('usuario_id', response.data.usuario_id);

      console.log('Tokens guardados:', response.data);
      // Aquí puedes redirigir al usuario o mostrar mensaje de éxito
      setTimeout(() => {
        setSuccess('');
      }, 3000); // Limpia el mensaje de éxito después de 3 segundos
      // Por ejemplo, redirigir a la página de inicio
      //window.location.href = '/login';
      // Limpia el formulario
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Ocurrió un error al registrar');
    }
  };

  return (
    <div className="registro-container">
      <Card className="login-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h1 className="welcome-text">Regístrate en Hasbun</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                required
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                className="input-dark"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                required
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ingresa tu apellido"
                className="input-dark"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu correo electrónico"
                className="input-dark"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="input-dark"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                required
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña nuevamente"
                className="input-dark"
              />
            </Form.Group>

            <Form.Check
              required
              label="Acepto términos y condiciones"
              feedback="Debes aceptar antes de continuar."
              feedbackType="invalid"
              className="mb-3"
            />

            <Button variant="danger" type="submit">
              Registrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Registro;
