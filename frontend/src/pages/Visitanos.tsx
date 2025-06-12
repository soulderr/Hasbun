import React from 'react';
import './Visitanos.css';

const Visitanos: React.FC = () => {
  return (
    <div className="visitanos-container">
      <h2 className="titulo">Visítanos en nuestras oficinas</h2>

      <div className="mapa-container">
        <iframe
          title="Ubicación de Hasbún y Cía. Ltda."
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.3237138854163!2d-71.47874888479635!3d-32.92380748092932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689c355730b8443%3A0x2acb033929e88f82!2sHASB%C3%9AN%20y%20C%C3%8DA.%20LTDA.!5e0!3m2!1ses-419!2scl!4v1718080000000"
          width="100%"
          height="350"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="contacto-wrapper">
        <div className="contacto-info">
          <p><strong>Juan Pérez</strong></p>
          <p>
            WhatsApp:{" "}
            <a href="https://wa.me/56977146357" target="_blank" rel="noopener noreferrer">
              +56 9 7714 6357
            </a>
          </p>
        </div>

        <div className="contacto-info">
          <p><strong>Marcela Montes</strong></p>
          <p>
            WhatsApp:{" "}
            <a href="https://wa.me/56981234567" target="_blank" rel="noopener noreferrer">
              +56 9 8123 4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Visitanos;
