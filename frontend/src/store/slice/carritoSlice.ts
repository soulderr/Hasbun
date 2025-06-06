import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Producto {
  idProducto: string;
  nombreProducto: string;
  precioProducto: number;
  imagen: string | null;
  cantidad: number;
}

interface CarritoState {
  items: Producto[];
}

const initialState: CarritoState = {
  items: JSON.parse(localStorage.getItem('carrito') || '[]'),
};

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    agregarProducto: (state, action: PayloadAction<Producto>) => {
      const index = state.items.findIndex(p => p.idProducto === action.payload.idProducto);
      if (index >= 0) {
        state.items[index].cantidad += action.payload.cantidad;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('carrito', JSON.stringify(state.items));
    },
    eliminarProducto: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.idProducto !== action.payload);
      localStorage.setItem('carrito', JSON.stringify(state.items));
    },
    actualizarCantidad: (state, action: PayloadAction<{ id: string; cantidad: number }>) => {
      const producto = state.items.find(p => p.idProducto === action.payload.id);
      if (producto) {
        producto.cantidad = action.payload.cantidad;
      }
      localStorage.setItem('carrito', JSON.stringify(state.items));
    },
    vaciarCarrito: (state) => {
      state.items = [];
      localStorage.removeItem('carrito');
    }
  },
});

export const { agregarProducto, eliminarProducto, actualizarCantidad, vaciarCarrito } = carritoSlice.actions;
export default carritoSlice.reducer;
