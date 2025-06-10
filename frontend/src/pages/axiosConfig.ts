import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

// Interceptor de solicitud para agregar token
api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (config.url && !config.url.includes('usuarios/recuperar')) {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de respuesta para manejar token expirado
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Si es error 401 y no hemos reintentado aún
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://127.0.0.1:8000/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccess = response.data.access;
        localStorage.setItem('accessToken', newAccess);

        // Actualizar header y reintentar
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccess}`,
        };

        return axios(originalRequest); // Reintento de la solicitud original
      } catch (refreshError) {
        // Si falla el refresh, forzar logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirige al login
      }
    }

    return Promise.reject(error);
  }
);

export default api;