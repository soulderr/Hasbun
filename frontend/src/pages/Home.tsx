import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdpzY46fNQqzdt483rFIqZZm4uTG0oprC7eQ&s"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGgaxNbefaP_MG81w9PRQjKAmyjGEwO36xQQ&s"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5JxDvZtPdHrCMROwyABsCKUm-f3DT3VwV1w&s"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Home;