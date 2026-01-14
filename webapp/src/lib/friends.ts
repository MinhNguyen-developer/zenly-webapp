// Friends service
import { apiFetch } from './api';
import type { User } from './auth';

export interface FriendLocation {
  latitude: number;
  longitude: number;
  status?: string;
  updatedAt: string;
}

export interface Friend extends User {
  location?: FriendLocation;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export const friendsService = {
  // Send friend request
  async sendRequest(receiverId: string): Promise<FriendRequest> {
    return apiFetch<FriendRequest>('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId }),
    });
  },

  // Accept friend request
  async acceptRequest(requestId: string): Promise<{ message: string }> {
    return apiFetch(`/friends/request/${requestId}/accept`, {
      method: 'POST',
    });
  },

  // Reject friend request
  async rejectRequest(requestId: string): Promise<{ message: string }> {
    return apiFetch(`/friends/request/${requestId}/reject`, {
      method: 'POST',
    });
  },

  // Get pending requests (received)
  async getPendingRequests(): Promise<FriendRequest[]> {
    return apiFetch<FriendRequest[]>('/friends/requests/pending');
  },

  // Get sent requests
  async getSentRequests(): Promise<FriendRequest[]> {
    return apiFetch<FriendRequest[]>('/friends/requests/sent');
  },

  // Get friends list
  async getFriends(): Promise<Friend[]> {
    return apiFetch<Friend[]>('/friends');
  },

  // Remove friend
  async removeFriend(friendId: string): Promise<{ message: string }> {
    return apiFetch(`/friends/${friendId}`, {
      method: 'DELETE',
    });
  },
};

