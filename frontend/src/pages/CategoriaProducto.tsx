import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Asume que tienes un archivo CSS para los productos, puedes crearlo o usar estilos existentes
import './CategoriaProducto.css'; 

interface ApiProduct {
  idProducto: string;
  nombreProducto: string;
  imagen: string | null;
  precioProducto: string | null; // O number si es un número
  precioNeto: string; // O number
  stock: number;
  descripcion: string;
  id_categoria: number;
  archivo_pdf?: string;
  // id_detalleVenta: number | null; // Descomenta si lo necesitas
  // id_carrito: number | null;    // Descomenta si lo necesitas
}

interface ApiCategory { // Para obtener el nombre de la categoría
  id_categoria: number;
  nombreCategoria: string;
  // ... otros campos de categoría si los necesitas
}

const CategoriaProducto: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsAndCategory = async () => {
      if (!categoryId) {
        setError("ID de categoría no proporcionado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const numericCategoryId = parseInt(categoryId, 10);

      if (isNaN(numericCategoryId)) {
        setError("ID de categoría inválido.");
        setLoading(false);
        return;
      }

      try {
        // 1. Obtener todos los productos
        const productsResponse = await fetch('http://127.0.0.1:8000/producto/'); // Ajusta si tu URL es /producto/producto/
        if (!productsResponse.ok) {
          throw new Error(`Error HTTP al obtener productos: ${productsResponse.status}`);
        }
        const allProducts: ApiProduct[] = await productsResponse.json();
        
        // Filtrar productos por id_categoria
        const filteredProducts = allProducts.filter(
          (product) => product.id_categoria === numericCategoryId
        );
        setProducts(filteredProducts);

        // 2. (Opcional pero recomendado) Obtener el nombre de la categoría para el título
        // Esto asume que tienes un endpoint para obtener una categoría específica o puedes filtrar de una lista completa
        // Por simplicidad, si ya tienes allCategories en un contexto o lo cargas de nuevo:
        try {
            const categoryResponse = await fetch(`http://127.0.0.1:8000/categoria/${numericCategoryId}/`);
            if (categoryResponse.ok) {
                const categoryData: ApiCategory = await categoryResponse.json();
                setCategoryName(categoryData.nombreCategoria);
            } else {
                // Si no se puede obtener la categoría específica, intenta encontrarla en una lista general
                // (esto requeriría cargar todas las categorías aquí también, o pasarlas)
                // Por ahora, un fallback:
                setCategoryName(`Productos de Categoría ${numericCategoryId}`);
            }
        } catch (catErr) {
            console.warn("No se pudo obtener el nombre de la categoría:", catErr);
            setCategoryName(`Productos de Categoría ${numericCategoryId}`);
        }


      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido al cargar productos.');
        }
        setProducts([]);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategory();
  }, [categoryId]);

  if (loading) {
    return <div className="products-page"><p>Cargando productos...</p></div>;
  }

  if (error) {
    return <div className="products-page"><p>Error: {error}</p></div>;
  }

  return (
    <div className="products-page">
      <u><h2 className="titulo">{categoryName || `Productos`}</h2></u>
      {products.length > 0 ? (
        <div className="product-list">
          {products.map(product => (
            // Asume que tienes una ruta para ver el detalle de un producto
            <Link to={`/producto/${product.idProducto}`} key={product.idProducto} className="product-item">
              <h3>{product.nombreProducto}</h3>
              <img 
                src={product.imagen || `https://via.placeholder.com/150/CCCCCC/FFFFFF?text=${encodeURIComponent(product.nombreProducto)}`} 
                alt={product.nombreProducto} 
                className="product-image"
              />
              <p>Precio Neto: ${product.precioNeto}</p>
              <p>Stock: {product.stock}</p>
              <p className="product-description">{product.descripcion}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p>No hay productos disponibles para esta categoría.</p>
      )}
      <Link to="/categoria" className="back-to-categories-link">Volver a Categorías</Link>
    </div>
  );
};

export default CategoriaProducto;