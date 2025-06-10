import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import Categoria from './pages/Categoria';
import Fierros from './pages/Fierros';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Inventario from './pages/Inventario';
import Contacto from './pages/Contacto';
import Cotizador from './pages/Cotizador';
import ProductoDetalle from './pages/ProductoDetalle'; // Importa el componente de detalles del producto
import './App.css';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './pages/PrivateRoute';
import CategoriaProducto from './pages/CategoriaProducto';
import ResetPassword from './pages/ResetPassword';
import OlvidePassword from './pages/OlvidePassword';
import Carrito from './components/Carrito';

function App() {
  return (
    <Router>
      <div id="root">
        <Header />
        <main>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/categoria/:categoryIdFromUrl" element={<Categoria />} /> {/* Ruta para subcategorías */}
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/productos/categoria/:categoryId" element={<CategoriaProducto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/cotizador" element={<Cotizador />} />
            <Route path="/dashboard" element={ <Dashboard />} />
            <Route path="/restablecer-password/:uid/:token/" element={<ResetPassword />} />
            <Route path="/recuperar" element={<OlvidePassword />} />
            <Route path="/carrito/items" element={<Carrito />} />
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;