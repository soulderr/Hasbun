import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PagoFallido: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orden = searchParams.get('orden');

  const [venta, setVenta] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orden) {
      axios.get(`http://localhost:8000/detalle-venta/?orden=${orden}`)
        .then(res => setVenta(res.data))
        .catch(err => console.error('Error al obtener venta', err));
    }
  }, [orden]);

  const reintentarPago = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/reintentar-pago/', { orden });
      const { url, token } = res.data;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = token;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error al reintentar pago', error);
      setLoading(false);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2>❌ Pago fallido</h2>
      <p>No pudimos procesar tu pago.</p>

      {venta && (
        <div className="mt-4">
          <h5>Resumen de tu intento de compra:</h5>
          <ul className="list-unstyled">
            {venta.productos.map((item: any, index: number) => (
              <li key={index}>
                {item.nombre} — {item.cantidad} x ${item.precio_unitario} = ${item.subtotal}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> ${venta.total}</p>
        </div>
      )}

      <button className="btn btn-warning mt-3" onClick={reintentarPago} disabled={loading}>
        {loading ? 'Redirigiendo...' : 'Reintentar pago'}
      </button>
    </div>
  );
};

export default PagoFallido;
