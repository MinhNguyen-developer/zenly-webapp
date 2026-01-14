// WebSocket connection for real-time location updates
import { io, Socket } from 'socket.io-client';
import { getToken } from './api';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export interface FriendLocationUpdate {
  userId: string;
  username: string;
  name: string | null;
  avatar: string | null;
  latitude: number;
  longitude: number;
  status?: string;
  updatedAt: string;
}

export interface FriendOnlineData {
  userId: string;
  username: string;
  name: string | null;
  avatar: string | null;
  location?: {
    latitude: number;
    longitude: number;
    status?: string;
  };
}

export interface FriendOfflineData {
  userId: string;
}

class LocationSocket {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    this.socket = io(`${SOCKET_URL}/location`, {
      auth: {
        token,
      },
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Emit events
  updateLocation(latitude: number, longitude: number, status?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit(
        'updateLocation',
        { latitude, longitude, status },
        (response: any) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error('Failed to update location'));
          }
        }
      );
    });
  }

  requestFriendsLocations(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('requestFriendsLocations', (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error('Failed to get friends locations'));
        }
      });
    });
  }

  // Listen to events
  onFriendLocationUpdate(callback: (data: FriendLocationUpdate) => void): void {
    this.socket?.on('friendLocationUpdate', callback);
  }

  onFriendOnline(callback: (data: FriendOnlineData) => void): void {
    this.socket?.on('friendOnline', callback);
  }

  onFriendOffline(callback: (data: FriendOfflineData) => void): void {
    this.socket?.on('friendOffline', callback);
  }

  // Friend Request Events
  onFriendRequestReceived(callback: (data: any) => void): void {
    this.socket?.on('friendRequestReceived', callback);
  }

  onFriendRequestAccepted(callback: (data: any) => void): void {
    this.socket?.on('friendRequestAccepted', callback);
  }

  onFriendRequestRejected(callback: (data: any) => void): void {
    this.socket?.on('friendRequestRejected', callback);
  }

  // Remove listeners
  offFriendLocationUpdate(callback?: (data: FriendLocationUpdate) => void): void {
    this.socket?.off('friendLocationUpdate', callback);
  }

  offFriendOnline(callback?: (data: FriendOnlineData) => void): void {
    this.socket?.off('friendOnline', callback);
  }

  offFriendOffline(callback?: (data: FriendOfflineData) => void): void {
    this.socket?.off('friendOffline', callback);
  }

  offFriendRequestReceived(callback?: (data: any) => void): void {
    this.socket?.off('friendRequestReceived', callback);
  }

  offFriendRequestAccepted(callback?: (data: any) => void): void {
    this.socket?.off('friendRequestAccepted', callback);
  }

  offFriendRequestRejected(callback?: (data: any) => void): void {
    this.socket?.off('friendRequestRejected', callback);
  }
}

export const locationSocket = new LocationSocket();

