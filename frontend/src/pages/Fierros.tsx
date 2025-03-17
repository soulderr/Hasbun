import React from 'react';
import { Link } from 'react-router-dom';
import './Fierros.css';

const Fierros: React.FC = () => {
  const categories = [
    { id: 1, name: 'Producto 1', description: '300MMx1MTS', image: 'https://www.dimasa.cl/assets/imagenes/productos/nwFIE0375-img_01-fbb023f8211c24b7d732.jpg' },
    { id: 2, name: 'Producto 2', description: '400MMx1MTS', image: 'https://www.weitzler.cl/bitobee/wp-content/uploads/2023/06/13002200042-1.jpg' },
    { id: 3, name: 'Producto 3', description: '500MMx1MTS', image: 'https://media.prodalam.cl/media-pim/22420/22420_20200729154847.jpeg?d=20200729154847?d=20200907094608?d=20200907105321' },
    { id: 4, name: 'Producto 4', description: '600MMx1MTS', image: 'https://socodima.cl/4060-large_default/tubo-cemento-200-mm-x-100-mt-52-kilos-x-tubo.jpg' }
  ];

  return (
    <div className="fierros">
      <u><h1 className='titulo'>Tubos</h1></u>
      <div className="category-list">
        {categories.map(category => (
          <Link 
            to={`/productos/${category.id}`} 
            key={category.id} 
            className="category-item"
            state={{ 
              id: category.id,
              name: category.name,
              description: category.description,
              image: category.image 
            }} // Pasar los datos del producto como parte del estado
          >
            <h3>{category.name}</h3>
            <img src={category.image} alt={category.name} className="category-image" />
            <p>{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Fierros;