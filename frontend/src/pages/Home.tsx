import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <h1 className="home-title">Bienvenido a nuestra tienda</h1>
      <h4 className="home-subtitle">Encuentra los mejores productos de hormigon</h4>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdpzY46fNQqzdt483rFIqZZm4uTG0oprC7eQ&s"
            alt="First slide"
          />
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGgaxNbefaP_MG81w9PRQjKAmyjGEwO36xQQ&s"
            alt="Second slide"
          />
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5JxDvZtPdHrCMROwyABsCKUm-f3DT3VwV1w&s"
            alt="Third slide"
          />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Home;