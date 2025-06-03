import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        email,
        password
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      navigate('/dashboard'); // o la ruta que desees
    } catch (error) {
      console.error('Error en login:', error);
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
