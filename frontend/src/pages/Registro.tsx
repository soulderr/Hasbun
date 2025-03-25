import React from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './Registro.css';

function Registro() {
  return (
    <div className="registro-container">
      <Card className="login-card">
        <Card.Body>
          <Form>
            <h1 className="welcome-text">Registrate en Hasbun</h1>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control required type="email" placeholder="Ingresa tu correo electronico" className="input-dark" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control required type="password" placeholder="Ingresa tu contraseña" className="input-dark" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control required type="password" placeholder="Ingresa tu contraseña nuevamente" className="input-dark" />
            </Form.Group>
            <Form.Check
              required
              label="Acepto terminos y condiciones"
              feedback="You must agree before submitting."
              feedbackType="invalid"
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