import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import api from './axiosConfig'; 

import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 🔐 Login: obtener access y refresh tokens
      const response = await api.post('http://127.0.0.1:8000/login/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // 🛒 Buscar carrito existente o crear uno nuevo
      try {
        const carritoResponse = await api.get('http://127.0.0.1:8000/carrito/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (Array.isArray(carritoResponse.data) && carritoResponse.data.length > 0) {
          // ✅ Ya existe carrito
          const carritoId = carritoResponse.data[0].id;
          localStorage.setItem('carritoId', carritoId.toString());
        } else {
          // ➕ Crear nuevo carrito si no existe
          const nuevoCarrito = await api.post(
            'http://127.0.0.1:8000/carrito/',
            {},
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
          localStorage.setItem('carritoId', nuevoCarrito.data.id.toString());
        }
      } catch (carritoError) {
        console.error('❌ Error al obtener o crear el carrito:', carritoError);
        alert('No se pudo establecer el carrito del usuario.');
      }

      // ✅ Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Error en login:', error);
      alert('Credenciales incorrectas');
    }
  };

  return (
    <Card className="login-card">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <h1 className="welcome-text">Bienvenido a Hasbun</h1>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="input-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              className="input-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="danger" type="submit">Ingresar</Button>
          <div className="text-center mt-3">
            <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Login;
