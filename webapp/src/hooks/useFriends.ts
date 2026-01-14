// Hook for managing friends
import { useState, useEffect } from 'react';
import { friendsService, Friend, FriendRequest } from '@/lib/friends';

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await friendsService.getFriends();
      setFriends(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch friends');
      console.error('Failed to fetch friends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const removeFriend = async (friendId: string) => {
    try {
      await friendsService.removeFriend(friendId);
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to remove friend');
    }
  };

  return {
    friends,
    isLoading,
    error,
    refetch: fetchFriends,
    removeFriend,
  };
}

export function useFriendRequests() {
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [pending, sent] = await Promise.all([
        friendsService.getPendingRequests(),
        friendsService.getSentRequests(),
      ]);
      setPendingRequests(pending);
      setSentRequests(sent);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch friend requests');
      console.error('Failed to fetch friend requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const sendRequest = async (receiverId: string) => {
    try {
      const request = await friendsService.sendRequest(receiverId);
      setSentRequests((prev) => [...prev, request]);
      return request;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to send friend request');
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await friendsService.acceptRequest(requestId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to accept friend request');
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await friendsService.rejectRequest(requestId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to reject friend request');
    }
  };

  return {
    pendingRequests,
    sentRequests,
    isLoading,
    error,
    refetch: fetchRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
  };
}

