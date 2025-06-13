import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import Categoria from './pages/Categoria';
import Fierros from './pages/Fierros';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Inventario from './pages/Inventario';
import Contacto from './pages/Contacto';
import ProductoDetalle from './pages/ProductoDetalle'; // Importa el componente de detalles del producto
import './App.css';
import PrivateRoute from './pages/PrivateRoute';
import CategoriaProducto from './pages/CategoriaProducto';
import ResetPassword from './pages/ResetPassword';
import OlvidePassword from './pages/OlvidePassword';
import Carrito from './components/Carrito';
import Visitanos from './pages/Visitanos';
import { FaWhatsapp } from 'react-icons/fa';
import Dashboard from './pages/Dashboard';
import AdminProductos from './admin/AdminProductos';
import AdminMensajesContacto from './admin/AdminMensajesContacto'; // Importa el componente de mensajes de contacto
function App() {
  return (
    <Router>
      <div id="root">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/categoria/:categoryIdFromUrl" element={<Categoria />} /> {/* Ruta para subcategorías */}
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/productos/categoria/:categoryId" element={<CategoriaProducto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/restablecer-password/:uid/:token/" element={<ResetPassword />} />
            <Route path="/recuperar" element={<OlvidePassword />} />
            <Route path="/carrito/items" element={<Carrito />} />
            <Route path="/visitanos" element={<Visitanos />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/productos" element={<AdminProductos />} />
            <Route path="/admin/contacto" element={<AdminMensajesContacto />} /> {/* Ruta para mensajes de contacto */}

         
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </main>
        <Footer />
      </div>
      <div className="whatsapp-float d-none d-lg-block">
        <a
          href="https://wa.me/56912345678"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={77} />
        </a>
      </div>
    </Router>
  );
}

export default App;
