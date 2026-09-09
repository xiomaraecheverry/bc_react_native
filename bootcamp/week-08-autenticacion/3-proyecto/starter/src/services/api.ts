// ============================================
// API INSTANCE — Instancia Axios con interceptores de autenticación
// ============================================
import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './tokenService';

export const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────
// REQUEST interceptor: inyectar access token
// ─────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─────────────────────────────────────────────
// RESPONSE interceptor: manejar 401 → refresh → retry
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no hemos reintentado todavía
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          await clearTokens();
          return Promise.reject(error);
        }

        // Llamar endpoint de refresh usando una instancia limpia de axios
        const { data } = await axios.post<{ accessToken: string; refreshToken?: string }>(
          'https://dummyjson.com/auth/refresh',
          {
            refreshToken,
            expiresInMins: 30,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 8000,
          },
        );

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken ?? refreshToken;

        // Guardar nuevos tokens en SecureStore
        await saveTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        // Actualizar header de la petición fallida y reintentar
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falló la renovación, limpiar tokens para forzar nuevo login
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { getAccessToken, getRefreshToken, saveTokens, clearTokens };

