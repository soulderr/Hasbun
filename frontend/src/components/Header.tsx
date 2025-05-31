import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Alternar el menú dropdown
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Cerrar el menú dropdown
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Redirigir cuando se hace clic en "Productos"
  const handleRedirectToCategorias = () => {
    window.location.href = '/categorias'; // Cambia la URL directamente
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/home" className="navbar-brand">
            <img 
              src="https://dojiw2m9tvv09.cloudfront.net/68086/brand/hasbun1774.png" 
              alt="Inicio" 
              className="navImage"
            />
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={toggleMenu} 
            aria-controls="navbarNavDropdown" 
            aria-expanded={menuOpen ? 'true' : 'false'} 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/cotizador" className="nav-link" onClick={closeMenu}>Cotiza</Link>
              </li>
              <li className="nav-item">
                <Link to="/categoria" className="nav-link" onClick={closeMenu}>Productos</Link>
              </li>
              <li className="nav-item">
                <Link to="/inventario" className="nav-link" onClick={closeMenu}>Inventario</Link>
              </li>
              <li className="nav-item">
                <Link to="/contacto" className="nav-link" onClick={closeMenu}>Contacto</Link>
              </li>
              <li className="nav-item">
                <Link to="/registro" className="nav-link" onClick={closeMenu}>Registrarse</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>Inicio de Sesión</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
