import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PagoExitoso = () => {
  const [searchParams] = useSearchParams();
  const orden = searchParams.get("orden");
  const navigate = useNavigate();

  const irADetalle = () => {
    if (orden) {
      navigate(`/detalle-venta?orden=${orden}`);
    }
  };

  return (
    <div className="text-center mt-5">
      <h2>✅ ¡Pago realizado con éxito!</h2>
      <p>Orden de compra generada: <strong>{orden}</strong></p>
      <button className="btn btn-primary mt-3" onClick={irADetalle}>
        Ver detalle de la venta
      </button>
    </div>
  );
};

export default PagoExitoso;
