import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
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
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 5;

  const baseUrl = "http://localhost:8000/venta/historial/";

  const fetchVentas = async (page = 1) => {
    try {
      const response = await axios.get(`${baseUrl}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      setVentas(response.data.results);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.error("❌ Error al cargar el historial de compras", error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Historial de Compras</h3>
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
            {ventas.map((venta, index) => (
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
        <Pagination.Prev
          onClick={() => previousPage && fetchVentas(currentPage - 1)}
          disabled={!previousPage}
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => fetchVentas(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => nextPage && fetchVentas(currentPage + 1)}
          disabled={!nextPage}
        />
      </Pagination>
    </div>
  );
};

export default HistorialCompras;
