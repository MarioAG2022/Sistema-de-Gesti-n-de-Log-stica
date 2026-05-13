import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, clearSession } from '../storage/auth.storage';

// Dispositivo físico en la misma red WiFi → usar IP local de la PC
// Emulador Android → cambiar a http://10.0.2.2:3000/api
// Simulador iOS  → cambiar a http://localhost:3000/api
export const BASE_URL = 'http://192.168.100.2:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: inyecta JWT ──────────
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor: maneja errores globales ──
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido — limpia sesión
      await clearSession();
    }
    return Promise.reject(error);
  },
);

export default api;
