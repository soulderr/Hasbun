import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../pages/axiosConfig'; // Asegúrate que usas tu axios con interceptor configurado

interface ProductoDetalle {
  idProducto: string;
  nombreProducto: string;
  imagen?: string;
  stock: number;
}

interface ItemCarrito {
  id: number;
  carrito: number;
  producto: string;
  producto_detalle?: ProductoDetalle;
  cantidad: number;
  precio_unitario: number | string;
  fecha_agregado?: string;
}

interface CarritoResponse {
  items: ItemCarrito[];
  total: string;
}

interface CarritoState {
  items: ItemCarrito[];
  total: number;
  cantidadTotal: number; 
  loading: boolean;
  error: string | null;
}

const initialState: CarritoState = {
  items: [],
  total: 0,
  cantidadTotal: 0, 
  loading: false,
  error: null,
};
// Fetch del carrito para usuario autenticado
export const fetchCarrito = createAsyncThunk('carrito/fetchCarrito', async (_, thunkAPI) => {
  try {
    const response = await api.get('/carrito/items/');
    const items = Array.isArray(response.data) ? response.data : response.data.items || [];
    const total = items.reduce((acc, item) => acc + item.cantidad * parseFloat(item.precio_unitario), 0);
    return { items, total: total.toFixed(2) };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error al cargar carrito');
  }
});

// Actualizar cantidad
export const actualizarCantidadThunk = createAsyncThunk(
  'carrito/actualizarCantidad',
  async ({ id, cantidad }: { id: number; cantidad: number }, thunkAPI) => {
    try {
      const response = await api.patch(`/carrito/items/${id}/`, { cantidad });
      return response.data; // ✅ devolvemos el item actualizado
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error al actualizar cantidad');
    }
  }
);

// Eliminar item
export const eliminarItemThunk = createAsyncThunk(
  'carrito/eliminarItem',
  async (id: number, thunkAPI) => {
    try {
      await api.delete(`/carrito/items/${id}/`);
      console.log('Token de acceso actual:', localStorage.getItem('access'));
      thunkAPI.dispatch(fetchCarrito());
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error al eliminar item');
    }
  }
);

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = parseFloat(action.payload.total);
        state.cantidadTotal = action.payload.items.reduce(
          (acc: number, item: ItemCarrito) => acc + item.cantidad,
          0
        );
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(actualizarCantidadThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].cantidad = action.payload.cantidad;
          state.items[index].precio_unitario = action.payload.precio_unitario;
        }

        // Recalcular total y cantidadTotal
        state.total = state.items.reduce(
          (acc, item) => acc + item.cantidad * parseFloat(item.precio_unitario.toString()),
          0
        );
        state.cantidadTotal = state.items.reduce((acc, item) => acc + item.cantidad, 0);
      });

  },
});

export default carritoSlice.reducer;
