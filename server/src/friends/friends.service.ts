import { Injectable, BadRequestException, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { SendFriendRequestDto } from './dto/friend.dto';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => 'LocationGateway'))
    private locationGateway?: any,
  ) {}

  async sendFriendRequest(senderId: string, dto: SendFriendRequestDto) {
    const { receiverId } = dto;

    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    // Check if receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('User not found');
    }

    // Check if already friends
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: senderId, friendId: receiverId },
          { userId: receiverId, friendId: senderId },
        ],
      },
    });

    if (existingFriendship) {
      throw new BadRequestException('Already friends');
    }

    // Check if request already exists
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId, status: 'PENDING' },
          { senderId: receiverId, receiverId: senderId, status: 'PENDING' },
        ],
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists');
    }

    // Create friend request
    const request = await this.prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Send real-time notification to receiver
    if (this.locationGateway) {
      this.locationGateway.notifyFriendRequestReceived(receiverId, {
        id: request.id,
        senderId: request.senderId,
        sender: request.sender,
        createdAt: request.createdAt,
      });
    }

    return request;
  }

  async acceptFriendRequest(userId: string, requestId: string) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new BadRequestException('Not authorized to accept this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request already processed');
    }

    // Create friendship (bidirectional)
    await this.prisma.$transaction([
      this.prisma.friendship.create({
        data: {
          userId: request.senderId,
          friendId: request.receiverId,
        },
      }),
      this.prisma.friendship.create({
        data: {
          userId: request.receiverId,
          friendId: request.senderId,
        },
      }),
      this.prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      }),
    ]);

    return { message: 'Friend request accepted' };
  }

  async rejectFriendRequest(userId: string, requestId: string) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new BadRequestException('Not authorized to reject this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request already processed');
    }

    await this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    // Send real-time notification to the original sender
    if (this.locationGateway) {
      this.locationGateway.notifyFriendRequestRejected(request.senderId, {
        id: request.id,
        rejectedBy: request.receiver,
        rejectedAt: new Date(),
      });
    }

    return { message: 'Friend request rejected' };
  }

  async getPendingRequests(userId: string) {
    const requests = await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests;
  }

  async getSentRequests(userId: string) {
    const requests = await this.prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'PENDING',
      },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests;
  }

  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: { userId },
      include: {
        friend: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            location: true,
          },
        },
      },
    });

    return friendships.map((f) => f.friend);
  }

  async removeFriend(userId: string, friendId: string) {
    // Remove bidirectional friendship
    await this.prisma.$transaction([
      this.prisma.friendship.deleteMany({
        where: {
          userId,
          friendId,
        },
      }),
      this.prisma.friendship.deleteMany({
        where: {
          userId: friendId,
          friendId: userId,
        },
      }),
    ]);

    return { message: 'Friend removed' };
  }

  async checkFriendship(userId: string, friendId: string): Promise<boolean> {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        userId,
        friendId,
      },
    });

    return !!friendship;
  }
}

