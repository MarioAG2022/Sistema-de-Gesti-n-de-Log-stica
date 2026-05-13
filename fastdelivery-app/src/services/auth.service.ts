import api from '../api/api';
import { LoginDto, LoginResponse } from '../types';

/**
 * POST /auth/login
 * Autentica un usuario y retorna JWT.
 */
export async function login(dto: LoginDto): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', dto);
  return data;
}
