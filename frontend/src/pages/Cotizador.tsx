import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './Cotizador.css';

interface Producto {
  nombre: string;
  precio: number;
}

const productos: Producto[] = [
  { nombre: 'Fierros', precio: 100 },
  { nombre: 'Tubos', precio: 200 },
  { nombre: 'Soleras', precio: 300 },
];

const Cotizador: React.FC = () => {
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [acumulado, setAcumulado] = useState<number>(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>('');

  const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const producto = productos.find(producto => producto.nombre === e.target.value);
    if (producto) {
      setPrecioUnitario(producto.precio);
      setProductoSeleccionado(producto.nombre);
    }
  };

  const handleCalcular = () => {
    const subtotal = cantidad * precioUnitario;
    setTotal(subtotal);
    setAcumulado(acumulado + subtotal);
  };

  const handleAgregarOtro = () => {
    setCantidad(1);
    setPrecioUnitario(0);
    setProductoSeleccionado('');
    setTotal(0);
  };

  return (
    <div className="cotizador-container">
      
          <h1 className="titulo">Cotizador</h1>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupProducto">
              <Form.Label>Producto</Form.Label>
              <Form.Select value={productoSeleccionado} onChange={handleProductoChange} className="input-dark">
                <option value="">Selecciona un producto</option>
                {productos.map((producto, index) => (
                  <option key={index} value={producto.nombre}>
                    {producto.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupCantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="input-dark"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPrecioUnitario">
              <Form.Label>Precio Unitario</Form.Label>
              <Form.Control
                type="number"
                value={precioUnitario}
                readOnly
                className="input-dark"
              />
            </Form.Group>
            <Button variant="danger" type="button" onClick={handleCalcular}>
              Calcular
            </Button>
            <h2 className="total">Total: ${total.toFixed(2)}</h2>
            <Button variant="secondary" type="button" onClick={handleAgregarOtro}>
              Agregar Otro Producto
            </Button>
          </Form>
          <h2 className="acumulado">Acumulado: ${acumulado.toFixed(2)}</h2>
        
    </div>
  );
};

export default Cotizador;