import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";

interface Venta {
  orden: string;
  fecha: string;
  total: number;
  estado: string;
  pdf_url: string;
}

const HistorialCompras: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
  const fetchVentas = async () => {
    try {
      const response = await axios.get("http://localhost:8000/venta/historial/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`
        }
      });

      console.log("📦 Respuesta paginada:", response.data);
      if (Array.isArray(response.data.results)) {
        setVentas(response.data.results);
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("❌ Error al cargar el historial de compras", error);
      setVentas([]);
    }
  };

  fetchVentas();
}, []);

  const totalPages = Math.max(1, Math.ceil(ventas.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const ventasPaginadas = ventas.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Historial de Compras</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {ventas.length === 0 && !error ? (
        <p>No tienes compras registradas aún.</p>
      ) : (
        <>
          <div className="table-responsive">
            <Table bordered hover responsive className="table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Orden</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {ventasPaginadas.map((venta, index) => (
                  <tr key={index}>
                    <td>{venta.orden}</td>
                    <td>{new Date(venta.fecha).toLocaleString()}</td>
                    <td>${venta.total.toLocaleString("es-CL")}</td>
                    <td>
                      <span className="badge bg-success">{venta.estado.toUpperCase()}</span>
                    </td>
                    <td>
                      <a
                        className="btn btn-sm btn-outline-danger"
                        href={venta.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Descargar PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <Pagination className="justify-content-center mt-3">
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default HistorialCompras;
