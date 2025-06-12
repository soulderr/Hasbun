import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  rol: number;
}

export const obtenerRolUsuario = (): number | null => {
  const token = localStorage.getItem('access');  // ← CORREGIDO
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.rol;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
};
