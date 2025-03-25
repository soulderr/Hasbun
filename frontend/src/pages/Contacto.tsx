import React from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './Contacto.css';

const Contacto: React.FC = () => {
  return (
    <div className="contacto-container">
      <Card className="contacto-card">
        <Card.Body>
          <h1 className="titulo">Contacto</h1>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control required type="text" placeholder="Ingresa tu nombre" className="input-dark" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control required type="email" placeholder="Ingresa tu correo electrónico" className="input-dark" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupMessage">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control required as="textarea" rows={3} placeholder="Ingresa tu mensaje" className="input-dark" />
            </Form.Group>
            <Button variant="danger" type="submit">
              Enviar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Contacto;