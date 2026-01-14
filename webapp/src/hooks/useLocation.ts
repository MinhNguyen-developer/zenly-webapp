// Hook for managing location with WebSocket updates
import { useState, useEffect, useCallback } from 'react';
import { locationService } from '@/lib/location';
import type { Location } from '@/lib/location';
import { locationSocket } from '@/lib/socket';
import type { FriendLocationUpdate } from '@/lib/socket';
import { useAuth } from './useAuth';

export function useLocation() {
  const { isAuthenticated } = useAuth();
  const [friendsLocations, setFriendsLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Update own location
  const updateLocation = useCallback(
    async (latitude: number, longitude: number, status?: string) => {
      try {
        if (isSocketConnected) {
          // Use WebSocket if connected
          await locationSocket.updateLocation(latitude, longitude, status);
        } else {
          // Fallback to REST API
          await locationService.updateLocation({ latitude, longitude, status });
        }
      } catch (err: any) {
        console.error('Failed to update location:', err);
        throw new Error(err.message || 'Failed to update location');
      }
    },
    [isSocketConnected]
  );

  // Fetch friends locations
  const fetchFriendsLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const locations = await locationService.getFriendsLocations();
      setFriendsLocations(locations);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch friends locations');
      console.error('Failed to fetch friends locations:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Setup WebSocket connection and listeners
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const socket = locationSocket.connect();

      socket.on('connect', () => {
        console.log('Socket connected');
        setIsSocketConnected(true);

        // Request initial friends locations
        locationSocket.requestFriendsLocations().then((response) => {
          if (response.success && response.locations) {
            setFriendsLocations(
              response.locations.map((loc: any) => ({
                id: loc.userId,
                userId: loc.userId,
                latitude: loc.latitude,
                longitude: loc.longitude,
                status: loc.status,
                updatedAt: loc.updatedAt,
                user: {
                  id: loc.userId,
                  username: loc.username,
                  name: loc.name,
                  avatar: loc.avatar,
                  email: '',
                  createdAt: '',
                },
              }))
            );
          }
        });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsSocketConnected(false);
      });

      // Listen for friend location updates
      locationSocket.onFriendLocationUpdate((data: FriendLocationUpdate) => {
        setFriendsLocations((prev) => {
          const existingIndex = prev.findIndex((loc) => loc.userId === data.userId);
          const newLocation: Location = {
            id: data.userId,
            userId: data.userId,
            latitude: data.latitude,
            longitude: data.longitude,
            status: data.status,
            updatedAt: data.updatedAt,
            user: {
              id: data.userId,
              username: data.username,
              name: data.name,
              avatar: data.avatar,
              email: '',
              createdAt: '',
            },
          };

          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newLocation;
            return updated;
          } else {
            return [...prev, newLocation];
          }
        });
      });

      // Listen for friend coming online
      locationSocket.onFriendOnline((data) => {
        if (data.location) {
          setFriendsLocations((prev) => {
            const existingIndex = prev.findIndex((loc) => loc.userId === data.userId);
            const newLocation: Location = {
              id: data.userId,
              userId: data.userId,
              latitude: data.location!.latitude,
              longitude: data.location!.longitude,
              status: data.location!.status,
              updatedAt: new Date().toISOString(),
              user: {
                id: data.userId,
                username: data.username,
                name: data.name,
                avatar: data.avatar,
                email: '',
                createdAt: '',
              },
            };

            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = newLocation;
              return updated;
            } else {
              return [...prev, newLocation];
            }
          });
        }
      });

      // Listen for friend going offline
      locationSocket.onFriendOffline((data) => {
        setFriendsLocations((prev) =>
          prev.filter((loc) => loc.userId !== data.userId)
        );
      });

      return () => {
        locationSocket.disconnect();
      };
    } catch (err) {
      console.error('Failed to setup socket:', err);
      // Fallback to REST API
      fetchFriendsLocations();
    }
  }, [isAuthenticated, fetchFriendsLocations]);

  return {
    friendsLocations,
    isLoading,
    error,
    isSocketConnected,
    updateLocation,
    refetch: fetchFriendsLocations,
  };
}

