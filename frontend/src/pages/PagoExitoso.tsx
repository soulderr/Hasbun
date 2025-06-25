import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PagoExitoso: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orden = searchParams.get('orden');

  const [venta, setVenta] = useState<any>(null);

  useEffect(() => {
    if (orden) {
      axios.get(`http://localhost:8000/detalle-venta/?orden=${orden}`)
        .then(res => setVenta(res.data))
        .catch(err => console.error('Error al cargar la venta:', err));
    }
  }, [orden]);

  return (
    <div className="container mt-5">
      <h2 className="text-success text-center">✅ ¡Pago exitoso!</h2>
      {venta ? (
        <div className="mt-4">
          <p><strong>Venta:</strong> #{venta.idVenta}</p>
          <p><strong>Usuario:</strong> {venta.usuario}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()}</p>
          <h4>Productos:</h4>
          <ul>
            {venta.productos.map((item: any, index: number) => (
              <li key={index}>
                {item.nombre} — {item.cantidad} x ${item.precio_unitario} = ${item.subtotal}
              </li>
            ))}
          </ul>
          <h5 className="mt-3">💰 Total pagado: ${venta.total}</h5>
        </div>
      ) : (
        <p>Cargando detalles de la venta...</p>
      )}
      <a href="/" className="btn btn-success mt-4">Volver al inicio</a>
    </div>
  );
};

export default PagoExitoso;
