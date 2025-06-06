import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import { FaShoppingCart } from 'react-icons/fa';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Leer y contar productos del carrito desde localStorage
  const updateCartCount = () => {
    const carrito = localStorage.getItem('carrito');
    if (carrito) {
      try {
        const items = JSON.parse(carrito);
        const total = items.reduce((acc: number, item: any) => acc + item.cantidad, 0);
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    // Escuchar eventos de actualización del carrito
    const handleCarritoActualizado = () => updateCartCount();
    window.addEventListener('carritoActualizado', handleCarritoActualizado);

    return () => {
      window.removeEventListener('carritoActualizado', handleCarritoActualizado);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

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
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto">
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
              <li className="nav-item">
                <button className="btn btn-outline-danger position-relative ms-2" onClick={() => { navigate('/carrito'); closeMenu(); }}>
                  🛒
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
