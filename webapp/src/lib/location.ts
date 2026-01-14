// Location service
import { apiFetch } from './api';
import type { User } from './auth';

export interface Location {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  status?: string;
  updatedAt: string;
  user?: User;
}

export interface UpdateLocationDto {
  latitude: number;
  longitude: number;
  status?: string;
}

export const locationService = {
  // Update current location
  async updateLocation(data: UpdateLocationDto): Promise<Location> {
    return apiFetch<Location>('/location', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get my location
  async getMyLocation(): Promise<Location> {
    return apiFetch<Location>('/location/me');
  },

  // Get friends locations
  async getFriendsLocations(): Promise<Location[]> {
    return apiFetch<Location[]>('/location/friends');
  },

  // Get user location
  async getUserLocation(userId: string): Promise<Location> {
    return apiFetch<Location>(`/location/${userId}`);
  },

  // Delete location
  async deleteLocation(): Promise<{ message: string }> {
    return apiFetch('/location', {
      method: 'DELETE',
    });
  },
};

