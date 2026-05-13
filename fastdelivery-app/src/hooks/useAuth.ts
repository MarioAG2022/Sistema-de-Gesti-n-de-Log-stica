import { useState } from 'react';
import { router } from 'expo-router';
import { AxiosError } from 'axios';
import { login } from '../services/auth.service';
import {
  saveToken,
  saveUser,
  clearSession,
  getToken,
  getUser,
  type StoredUser,
} from '../storage/auth.storage';
import type { LoginDto } from '../types';

interface AuthState {
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ loading: false, error: null });

  const signIn = async (dto: LoginDto) => {
    setState({ loading: true, error: null });
    try {
      const response = await login(dto);
      await saveToken(response.access_token);
      await saveUser(response.user);
      router.replace('/orders');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        'Error de conexión. Verificá que el backend esté corriendo.';
      setState({ loading: false, error: message });
    }
  };

  const signOut = async () => {
    await clearSession();
    router.replace('/login');
  };

  const checkSession = async (): Promise<{
    token: string | null;
    user: StoredUser | null;
  }> => {
    const [token, user] = await Promise.all([getToken(), getUser()]);
    return { token, user };
  };

  return {
    loading: state.loading,
    error: state.error,
    signIn,
    signOut,
    checkSession,
  };
}
