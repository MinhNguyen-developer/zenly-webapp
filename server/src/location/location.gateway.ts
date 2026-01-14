import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { LocationService } from './location.service';
import { FriendsService } from '@/friends/friends.service';
import { UpdateLocationDto } from './dto/location.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/location',
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(
    private locationService: LocationService,
    private friendsService: FriendsService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Store socket connection
      this.userSockets.set(userId, client.id);
      client.data.userId = userId;

      console.log(`✅ User ${userId} connected to location tracking`);

      // Notify friends that user is online
      await this.notifyFriendsUserOnline(userId);
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userSockets.delete(userId);
      console.log(`❌ User ${userId} disconnected from location tracking`);

      // Notify friends that user is offline
      await this.notifyFriendsUserOffline(userId);
    }
  }

  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateLocationDto,
  ) {
    try {
      const userId = client.data.userId;

      if (!userId) {
        return { error: 'Unauthorized' };
      }

      // Update location in database
      const location = await this.locationService.updateLocation(userId, data);

      // Get user's friends
      const friends = await this.friendsService.getFriends(userId);

      // Broadcast location to all friends who are connected
      friends.forEach((friend) => {
        const friendSocketId = this.userSockets.get(friend.id);
        if (friendSocketId) {
          this.server.to(friendSocketId).emit('friendLocationUpdate', {
            userId,
            username: location.user.username,
            name: location.user.name,
            avatar: location.user.avatar,
            latitude: location.latitude,
            longitude: location.longitude,
            status: location.status,
            updatedAt: location.updatedAt,
          });
        }
      });

      return {
        success: true,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          status: location.status,
        },
      };
    } catch (error) {
      console.error('Location update error:', error);
      return { error: error.message };
    }
  }

  @SubscribeMessage('requestFriendsLocations')
  async handleRequestFriendsLocations(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.data.userId;

      if (!userId) {
        return { error: 'Unauthorized' };
      }

      const locations = await this.locationService.getFriendsLocations(userId);

      return {
        success: true,
        locations: locations.map((loc) => ({
          userId: loc.user.id,
          username: loc.user.username,
          name: loc.user.name,
          avatar: loc.user.avatar,
          latitude: loc.latitude,
          longitude: loc.longitude,
          status: loc.status,
          updatedAt: loc.updatedAt,
        })),
      };
    } catch (error) {
      console.error('Request friends locations error:', error);
      return { error: error.message };
    }
  }

  private async notifyFriendsUserOnline(userId: string) {
    try {
      const friends = await this.friendsService.getFriends(userId);
      const location = await this.locationService.getLocation(userId);

      friends.forEach((friend) => {
        const friendSocketId = this.userSockets.get(friend.id);
        if (friendSocketId) {
          this.server.to(friendSocketId).emit('friendOnline', {
            userId,
            username: location?.user.username,
            name: location?.user.name,
            avatar: location?.user.avatar,
            location: location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  status: location.status,
                }
              : null,
          });
        }
      });
    } catch (error) {
      console.error('Notify friends online error:', error);
    }
  }

  private async notifyFriendsUserOffline(userId: string) {
    try {
      const friends = await this.friendsService.getFriends(userId);

      friends.forEach((friend) => {
        const friendSocketId = this.userSockets.get(friend.id);
        if (friendSocketId) {
          this.server.to(friendSocketId).emit('friendOffline', {
            userId,
          });
        }
      });
    } catch (error) {
      console.error('Notify friends offline error:', error);
    }
  }

  // Friend Request Notifications
  async notifyFriendRequestReceived(receiverId: string, requestData: any) {
    const receiverSocketId = this.userSockets.get(receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('friendRequestReceived', requestData);
      console.log(`📬 Sent friend request notification to user ${receiverId}`);
    }
  }

  async notifyFriendRequestAccepted(senderId: string, acceptorData: any) {
    const senderSocketId = this.userSockets.get(senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('friendRequestAccepted', acceptorData);
      console.log(`✅ Sent friend request accepted notification to user ${senderId}`);
    }
  }

  async notifyFriendRequestRejected(senderId: string, rejectorData: any) {
    const senderSocketId = this.userSockets.get(senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('friendRequestRejected', rejectorData);
      console.log(`❌ Sent friend request rejected notification to user ${senderId}`);
    }
  }

  // Get connected socket ID for a user (useful for other services)
  getUserSocketId(userId: string): string | undefined {
    return this.userSockets.get(userId);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
