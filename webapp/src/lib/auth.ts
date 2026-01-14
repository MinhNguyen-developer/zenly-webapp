// Authentication service
import { apiFetch, setToken, removeToken, getToken } from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  emailOrUsername: string;
  password: string;
}

export const authService = {
  // Register a new user
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(response.token);
    return response;
  },

  // Login
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(response.token);
    return response;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    return apiFetch<User>('/auth/me');
  },

  // Logout
  logout(): void {
    removeToken();
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return getToken() !== null;
  },
};

