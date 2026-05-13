import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, clearSession } from '../storage/auth.storage';
import { router } from 'expo-router';

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  // 1. Prioridad: Variable de entorno (si existe)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Si corre en Expo Go en un celular físico, saca la IP de la PC automáticamente
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3000/api`;
  }

  // 3. Emulador Android
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  
  // 4. Simulador iOS o Web
  return 'http://localhost:3000/api';
};

export const BASE_URL = getBaseUrl();

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
      // Token expirado o inválido — limpia sesión y redirige al login
      await clearSession();
      router.replace('/login');
    }
    return Promise.reject(error);
  },
);

export default api;
