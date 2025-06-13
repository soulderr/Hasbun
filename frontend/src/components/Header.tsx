import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchCarrito } from '../store/slice/carritoSlice';
import { FaWhatsapp } from 'react-icons/fa';
import { obtenerRolUsuario } from '../utils/authUtils'; 



const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = Boolean(localStorage.getItem('access'));
  const cantidadTotal = useAppSelector(state => state.carrito.cantidadTotal);

  const [cartCountInvitado, setCartCountInvitado] = useState(0);
  const rol = obtenerRolUsuario(); // Esto te da: 0 (usuario), 1 (admin), o null (invitado)
  const updateCartCountInvitado = () => {
    const carrito = localStorage.getItem('carrito');
    if (carrito) {
      try {
        const items = JSON.parse(carrito);
        const total = items.reduce((acc: number, item: any) => acc + item.cantidad, 0);
        setCartCountInvitado(total);
      } catch {
        setCartCountInvitado(0);
      }
    } else {
      setCartCountInvitado(0);
    }
  };
  console.log("ROL:", rol);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCarrito());
    } else {
      updateCartCountInvitado();
    }

    const handleCarritoActualizado = () => {
      if (isAuthenticated) {
        dispatch(fetchCarrito());
      } else {
        updateCartCountInvitado();
      }
    };

    window.addEventListener('carritoActualizado', handleCarritoActualizado);
    return () => window.removeEventListener('carritoActualizado', handleCarritoActualizado);
  }, [dispatch, isAuthenticated]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
    window.location.reload(); // Recarga para actualizar el header según el rol
  };

  return (
    <>
      {rol === null && (
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
              <button className="navbar-toggler" type="button" onClick={toggleMenu}>
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link to="/categoria" className="nav-link" onClick={closeMenu}>Productos</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/contacto" className="nav-link" onClick={closeMenu}>Contacto</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/visitanos" className="nav-link" onClick={closeMenu}>Visitanos</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/registro" className="nav-link" onClick={closeMenu}>Registrarse</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link" onClick={closeMenu}>Inicio de Sesión</Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-danger position-relative ms-2"
                      onClick={() => {
                        navigate('/carrito/items');
                        closeMenu();
                      }}
                    >
                      🛒
                      {(isAuthenticated ? cantidadTotal : cartCountInvitado) > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {isAuthenticated ? cantidadTotal : cartCountInvitado}
                        </span>
                      )}
                    </button>
                  </li> 
                  <li className="nav-item d-none d-lg-block mx-auto">
                    <a
                      href="https://wa.me/56977146357" // reemplaza con el número de tu empresa
                      className="nav-link text-success d-flex align-items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp size={24} style={{ marginRight: '5px' }} />
                      Contactar por WhatsApp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      )}
      {rol === 0 && (
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
              <button className="navbar-toggler" type="button" onClick={toggleMenu}>
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link to="/categoria" className="nav-link" onClick={closeMenu}>Productos</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/contacto" className="nav-link" onClick={closeMenu}>Contacto</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/visitanos" className="nav-link" onClick={closeMenu}>Visítanos</Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-danger position-relative ms-2"
                      onClick={() => {
                        navigate('/carrito/items');
                        closeMenu();
                      }}
                    >
                      🛒
                      {(isAuthenticated ? cantidadTotal : cartCountInvitado) > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {isAuthenticated ? cantidadTotal : cartCountInvitado}
                        </span>
                      )}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </li>
                  <li className="nav-item d-none d-lg-block mx-auto">
                    <a
                      href="https://wa.me/56977146357"
                      className="nav-link text-success d-flex align-items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp size={24} style={{ marginRight: '5px' }} />
                      Contactar por WhatsApp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      )}
      {rol === 1 && (
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
            <button className="navbar-toggler" type="button" onClick={toggleMenu}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link to="/admin/productos" className="nav-link" onClick={closeMenu}>Panel Admin</Link>
                </li>
                <li className="nav-item">
                  <Link to="/contacto" className="nav-link" onClick={closeMenu}>Contacto</Link>
                </li>
                <li className="nav-item">
                  <Link to="/visitanos" className="nav-link" onClick={closeMenu}>Visítanos</Link>
                </li>
                <li className="nav-item">
                  <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                      Cerrar Sesión
                  </button>
                </li>
                <li className="nav-item d-none d-lg-block mx-auto">
                  <a
                    href="https://wa.me/56977146357"
                    className="nav-link text-success d-flex align-items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp size={24} style={{ marginRight: '5px' }} />
                    Contactar por WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    )}
    </>
  );
};

export default Header;
