import { API_URL } from '../constant/api';
import { LoginRequest, LoginResponse } from '../types/auth';

export async function loginService(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = (await response.json()) as LoginResponse | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Login failed');
  }

  return data as LoginResponse;
}
