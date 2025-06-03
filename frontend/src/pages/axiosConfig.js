import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

api.interceptors.request.use(config => {
  // Evita enviar Authorization para la recuperación de contraseña
  if (!config.url.includes('usuarios/recuperar')) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
