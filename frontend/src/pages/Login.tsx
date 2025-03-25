import React from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './Login.css';

function Login() {
  return (
    <Card className="login-card">
      <Card.Body>
        <Form>
          <h1 className="welcome-text">Bienvenido a Hasbun</h1>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Ingresa tu correo electronico" className="input-dark" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Ingresa tu contraseña" className="input-dark" />
          </Form.Group>
          <Button variant="danger" type="submit">
            Ingresar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Login;