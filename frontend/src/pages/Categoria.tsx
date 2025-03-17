import React from 'react';
import { Link } from 'react-router-dom';
import './Categoria.css';


const Categoria: React.FC = () => {
  const categories = [
    { id: 1, name: 'Tubos', description: 'Son fierros de contruccion', image: 'https://fibiser.com/cdn/shop/files/3_eb236a32-cf1e-4fb6-ab8f-793d3df0f072.png?v=1713306289' },
    { id: 2, name: 'Pastelones', description: 'Son pastelones de contruccion', image: 'https://casapastelon.cl/cdn/shop/products/piedrario2.jpg?v=1663072241' },
    { id: 3, name: 'Tuberias', description: 'Son tuberias de contruccion', image: 'https://socodima.cl/4060-large_default/tubo-cemento-200-mm-x-100-mt-52-kilos-x-tubo.jpg' },
    { id: 4, name: 'Categoria 4', description: 'Son Categoria 4 de contruccion', image: 'https://socodima.cl/4060-large_default/tubo-cemento-200-mm-x-100-mt-52-kilos-x-tubo.jpg' },
    { id: 5, name: 'Categoria 5', description: 'Son Categoria 5 de contruccion', image: 'https://socodima.cl/4060-large_default/tubo-cemento-200-mm-x-100-mt-52-kilos-x-tubo.jpg' },
    { id: 6, name: 'Categoria 6', description: 'Son Categoria 6 de contruccion', image: 'https://socodima.cl/4060-large_default/tubo-cemento-200-mm-x-100-mt-52-kilos-x-tubo.jpg' },
    { id: 7, name: 'Categoria 7', description: 'Son Categoria 7 de contruccion', image: 'https://socodima.cl/4060-large_default/tubo-cemento-200-mm-x-100-mt-52-kilos-x-tubo.jpg' }
  ];

  return (
    <>
        <div className="categoria">
          <u><h2 className="titulo">Categorías de Productos</h2></u>
          <div className="category-list">
            {categories.map(category => (
              <Link to={`/categorias/${category.id}`} key={category.id} className="category-item">
                <h3>{category.name}</h3>
                <img src={category.image} alt={category.name} className="category-image" />
                <p>{category.description}</p>
              </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categoria;