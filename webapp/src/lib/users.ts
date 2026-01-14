// Users service
import { apiFetch } from './api';
import type { User } from './auth';

export const usersService = {
  // Search users
  async searchUsers(search: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    return apiFetch<User[]>(`/users?${params.toString()}`);
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    return apiFetch<User>(`/users/${id}`);
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<User> {
    return apiFetch<User>(`/users/username/${username}`);
  },
};

