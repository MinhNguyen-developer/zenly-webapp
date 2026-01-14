// API client configuration and base utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

export class ApiException extends Error {
  public statusCode: number;
  public error: string;

  constructor(statusCode: number, message: string, error: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.name = 'ApiException';
  }
}

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set token
export const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove token
export const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

// Base fetch wrapper with auth
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      statusCode: response.status,
      message: response.statusText,
      error: 'Unknown Error',
    }));
    throw new ApiException(error.statusCode, error.message, error.error);
  }

  return response.json();
};

export default API_BASE_URL;

