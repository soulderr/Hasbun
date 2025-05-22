import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Registro.css';
const API_URL = 'http://127.0.0.1:8000/api/registro/';

function Registro() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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
      const response = await axios.post(API_URL, {
        username: formData.email,
        email: formData.email,
        password: formData.password,
      });

      setSuccess('Registro exitoso');
      // Guarda tokens en localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      console.log('Tokens guardados:', response.data);
      // Aquí puedes redirigir al usuario o mostrar mensaje de éxito
      // Por ejemplo, redirigir a la página de inicio
      window.location.href = '/home';
      // Limpia el formulario
      setFormData({
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
