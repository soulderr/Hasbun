import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import Categoria from './pages/Categoria';
import Fierros from './pages/Fierros';
import ProductoDetalle from './pages/ProductoDetalle'; // Importa el componente de detalles del producto
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categoria />} />
          <Route path="/categorias/1" element={<Fierros />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} /> {/* Asegúrate de que la ruta esté definida correctamente */}
          {/* Agrega más rutas según sea necesario */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;