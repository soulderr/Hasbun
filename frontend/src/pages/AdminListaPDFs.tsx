import React, { useEffect, useState } from "react";
import axios from "axios";

interface PDFVenta {
  orden: string;
  pdf_url: string;
}

const AdminListaPDFs: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDFVenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/venta/pdf-lista/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
          }
        });
        setPdfs(response.data);
      } catch (error) {
        console.error("❌ Error al cargar PDFs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Lista de PDFs de Ventas</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Orden</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {pdfs.map((pdf) => (
                <tr key={pdf.orden}>
                  <td>{pdf.orden}</td>
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
      )}
    </div>
  );
};

export default AdminListaPDFs;
