import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="navLink">
          <img 
            src="https://dojiw2m9tvv09.cloudfront.net/68086/brand/hasbun1774.png" 
            alt="Inicio" 
            className="navImage"
        />
        </Link>
        <ul className={`navList ${menuOpen ? 'active' : ''}`}>
          <li className="navItem"><Link to="/quotes" className="navLink">Cotiza</Link></li>
          <li className="navItem dropdown">
            <Link to="/categorias" className="navLink">Productos</Link>
            <ul className="dropdownMenu">
              <li className="dropdownItem"><Link to="/categorias/1" className="navLink">Tubos</Link></li>
              <li className="dropdownItem"><Link to="/categorias/item2" className="navLink">Pastelones</Link></li>
              <li className="dropdownItem"><Link to="/categorias/item3" className="navLink">Tuberias</Link></li>
              <li className="dropdownItem"><Link to="/categorias/item4" className="navLink">Categoria 4</Link></li>
              <li className="dropdownItem"><Link to="/categorias/item5" className="navLink">Categoria 5</Link></li>
              <li className="dropdownItem"><Link to="/categorias/item6" className="navLink">Categoria 6</Link></li>
              <li className="dropdownItem"><Link to="/categorias/item7" className="navLink">Categoria 7</Link></li>
            </ul>
          </li>
          <li className="navItem"><Link to="/inventario" className="navLink">Inventario</Link></li>
          <li className="navItem"><Link to="/contacto" className="navLink">Contacto</Link></li>
          <li className="navItem"><Link to="/registro" className="navLink">Registrarse</Link></li>
          <li className="navItem"><Link to="/inicioSesion" className="navLink">Inicio de Sesión</Link></li>
        </ul>
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>
    </header>
  );
};

export default Header;