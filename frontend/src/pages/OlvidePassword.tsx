import React, { useState } from 'react';
import api from './axiosConfig';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

function OlvidePassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:8000/usuarios/solicitar-recuperacion/', { email });
      setMessage('Si el correo está registrado, se ha enviado un enlace para restablecer tu contraseña.');
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError('El correo no está registrado.');
      } else {
        setError('Ocurrió un error. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-card">
      <Card.Body>
        <h2 className="mb-4 text-center">Recuperar contraseña</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="danger" disabled={loading} className="w-100">
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Enviando...
              </>
            ) : (
              'Enviar enlace de recuperación'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default OlvidePassword;
