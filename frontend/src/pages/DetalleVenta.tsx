import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

interface ProductoDetalle {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface DetalleVenta {
  idVenta: number;
  usuario: string;
  fecha: string;
  total: number;
  estado: string;
  productos: ProductoDetalle[];
}
const handleDescargarPDF = () => {
  if (orden) {
    window.open(`http://localhost:8000/venta/pdf/${orden}/`, "_blank");
  }
};

const DetalleVenta: React.FC = () => {
  const [venta, setVenta] = useState<DetalleVenta | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orden = searchParams.get("orden");

  useEffect(() => {
    const fetchVenta = async () => {
        try {
        const response = await axios.get(`http://localhost:8000/venta/detalle-venta/?orden=${orden}`);
        console.log("✅ Datos recibidos:", response.data); // <-- Agrega esto
        setVenta(response.data);
        } catch (error) {
        console.error("Error al obtener detalles de venta:", error);
        } finally {
        setLoading(false);
        }
    };

    if (orden) {
        fetchVenta();
    }
    }, [orden]);


  if (loading) return <div className="container mt-4">Cargando...</div>;
  if (!venta) return <div className="container mt-4">No se encontró la venta.</div>;

  return (
<div style={{ marginTop: '155px' }}>
    <div className="card p-4 shadow-sm">
        <div className="container mt-4">
        <h3 className="mb-3">
            🧾 Resumen de Venta <small className="text-muted">#{venta.idVenta}</small>
        </h3>

        <div className="mb-3">
            <p><strong>Cliente:</strong> {venta.usuario}</p>
            <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString("es-CL", {
                dateStyle: "long",
                timeStyle: "short"
                })}</p>
            <p>
            <strong>Estado:</strong>{" "}
            <span className={`badge ${venta.estado === "pagado" ? "bg-success" : "bg-warning"}`}>
                {venta.estado.toUpperCase()}
            </span>
            </p>
        </div>

        <div className="table-responsive">
            <table className="table table-bordered table-striped">
            <thead className="table-dark">
                <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {venta.productos.map((prod, index) => (
                <tr key={index}>
                    <td>{prod.nombre}</td>
                    <td>{prod.cantidad}</td>
                    <td>${prod.precio_unitario.toLocaleString("es-CL")}</td>
                    <td>${prod.subtotal.toLocaleString("es-CL")}</td>
                </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                <td colSpan={3} className="text-end"><strong>Total</strong></td>
                <td><strong>${venta.total.toLocaleString("es-CL")}</strong></td>
                </tr>
                <tr>
                <td colSpan={4} className="text-center">
                    <button className="btn btn-outline-danger" onClick={handleDescargarPDF}>
                    Descargar PDF
                    </button>
                </td>
                </tr>
            </tfoot>
            </table>
        </div>
        </div>
    </div>
</div>
  );
};

export default DetalleVenta;
