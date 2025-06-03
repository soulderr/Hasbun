import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './axiosConfig'
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import './ResetPassword.css'; // Añade estilos extra si quieres

function ResetPassword() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!uid || !token) {
      setError('Parámetros inválidos en la URL.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      // Llamada al backend (usar ruta relativa: 'recuperar/:uid/:token/')
      await api.post(`usuarios/recuperar/${uid}/${token}/`, { password });

      // Si el backend responde con 200:
      setSuccessMsg('Contraseña actualizada correctamente. Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);

      // Si el backend responde con 400 o 404, mostramos el detalle:
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 400) {
          // Puede ser validación de contraseña:
          if (data.password) {
            setError(`Error: ${data.password.join(' ')}`);
          } else if (data.token) {
            setError(`Error: ${data.token}`);
          } else {
            setError('Error en el formulario. Verifica tus datos.');
          }
        } else if (status === 404) {
          setError('Enlace inválido o usuario no encontrado.');
        } else if (status === 401) {
          setError('Token inválido o expirado.');
        } else {
          setError('Ocurrió un error inesperado. Intenta más tarde.');
        }
      } else if (err.request) {
        // La petición se envió pero no hubo respuesta (Network Error)
        setError('No se pudo conectar al servidor. Verifica tu conexión.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <Card className="reset-card">
        <Card.Body>
          <h2 className="mb-4 text-center">Restablecer contraseña</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success" role="alert">
              {successMsg}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                disabled={loading}
                required
              />
            </Form.Group>

            <Button
              variant="danger"
              type="submit"
              className="w-100"
              disabled={loading}
            >
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
                  Actualizando...
                </>
              ) : (
                'Cambiar contraseña'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ResetPassword;
