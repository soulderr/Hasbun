import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";

interface PDFVenta {
  orden: string;
  pdf_url: string;
  fecha: string;
}

const AdminListaPDFs: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDFVenta[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("http://localhost:8000/venta/pdf-lista/");

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await axios.get(currentUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        setPdfs(response.data.results);
        setNext(response.data.next);
        setPrevious(response.data.previous);
      } catch (error) {
        console.error("❌ Error al cargar PDFs:", error);
      }
    };

    fetchPDFs();
  }, [currentUrl]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Lista de PDFs de Ventas</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Orden</th>
              <th>Fecha</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.map((pdf) => (
              <tr key={pdf.orden}>
                <td>{pdf.orden}</td>
                <td>{new Date(pdf.fecha).toLocaleString("es-CL")}</td>
                <td>
                  <a
                    className="btn btn-sm btn-outline-danger"
                    href={pdf.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Descargar PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => previous && setCurrentUrl(previous)}
          disabled={!previous}
        />
        <Pagination.Next
          onClick={() => next && setCurrentUrl(next)}
          disabled={!next}
        />
      </Pagination>
    </div>
  );
};

export default AdminListaPDFs;
