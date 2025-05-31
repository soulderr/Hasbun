import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Importar useParams
import './Categoria.css';

interface ApiCategory {
  id_categoria: number;
  nombreCategoria: string;
  descripcion: string;
  imagen: string | null;
  id_Producto: number | null;
  idCategoriaPadre: number | null;
}

const Categoria: React.FC = () => {
  const { categoryIdFromUrl } = useParams<{ categoryIdFromUrl?: string }>(); // Obtener el ID de la URL

  const [allCategories, setAllCategories] = useState<ApiCategory[]>([]);
  // Este estado ahora contendrá las categorías a mostrar (principales o subcategorías)
  const [displayedCategories, setDisplayedCategories] = useState<ApiCategory[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('Categorías Principales de Productos');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Efecto para cargar todas las categorías una sola vez
  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/categoria/');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data: ApiCategory[] = await response.json();
        setAllCategories(data);
        setError(null); // Limpiar errores previos si la carga es exitosa
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido al cargar categorías.');
        }
        setAllCategories([]); // Limpiar categorías en caso de error
        console.error("Error al obtener todas las categorías:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Efecto para filtrar y establecer las categorías a mostrar y el título
  useEffect(() => {
    if (allCategories.length > 0) { // Solo proceder si allCategories tiene datos
      if (categoryIdFromUrl) {
        const parentId = parseInt(categoryIdFromUrl, 10);
        if (isNaN(parentId)) {
            setError("ID de categoría inválido en la URL.");
            setDisplayedCategories([]);
            setPageTitle("Error");
            return;
        }

        const subCategories = allCategories.filter(
          (category) => category.idCategoriaPadre === parentId
        );
        setDisplayedCategories(subCategories);

        const parentCategory = allCategories.find(
          (category) => category.id_categoria === parentId
        );
        setPageTitle(
          parentCategory
            ? `Subcategorías de ${parentCategory.nombreCategoria}`
            : 'Subcategorías no encontradas'
        );
      } else {
        // Mostrar categorías principales si no hay categoryIdFromUrl
        const filteredMainCategories = allCategories.filter(
          (category) => category.idCategoriaPadre === null
        );
        setDisplayedCategories(filteredMainCategories);
        setPageTitle('Categorías Principales de Productos');
      }
    } else if (!loading) { // Si no hay categorías y no está cargando (posiblemente por un error inicial)
        setDisplayedCategories([]);
        if (!error) { // Si no hay un error específico de carga, pero no hay categorías
            setPageTitle('No hay categorías disponibles');
        }
    }
  }, [allCategories, categoryIdFromUrl, loading, error]); // Depende de allCategories y el ID de la URL

  if (loading) {
    return <div className="categoria"><p>Cargando categorías...</p></div>;
  }

  if (error) {
    return <div className="categoria"><p>Error al cargar categorías: {error}</p></div>;
  }

  return (
    <>
      <div className="categoria">
        <u><h2 className="titulo">{pageTitle}</h2></u>
        {displayedCategories.length > 0 ? (
          <div className="category-list">
            {displayedCategories.map(category => (
              <Link 
                // Si la categoría actual es una categoría principal (no tiene padre Y hay subcategorías para ella),
                // el enlace va a mostrar sus subcategorías.
                // De lo contrario (es una subcategoría o una principal sin más subcategorías),
                // el enlace va a mostrar sus productos.
                to={category.idCategoriaPadre === null && allCategories.some(sub => sub.idCategoriaPadre === category.id_categoria)
                    ? `/categoria/${category.id_categoria}` 
                    : `/productos/categoria/${category.id_categoria}`
                }
                key={category.id_categoria} 
                className="category-item"
              >
                <h3>{category.nombreCategoria}</h3>
                <img
                  src={category.imagen || `https://via.placeholder.com/150/CCCCCC/FFFFFF?text=${encodeURIComponent(category.nombreCategoria)}`}
                  alt={category.nombreCategoria}
                  className="category-image"
                />
                <p>{category.descripcion || 'Sin descripción'}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p>{categoryIdFromUrl ? 'No hay subcategorías disponibles para esta categoría.' : 'No hay categorías principales disponibles.'}</p>
        )}
      </div>
    </>
  );
};

export default Categoria;