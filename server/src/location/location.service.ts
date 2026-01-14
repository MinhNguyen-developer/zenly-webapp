import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { UpdateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async updateLocation(userId: string, dto: UpdateLocationDto) {
    const { latitude, longitude, status } = dto;

    const location = await this.prisma.location.upsert({
      where: { userId },
      update: {
        latitude,
        longitude,
        status: status || 'Available',
        updatedAt: new Date(),
      },
      create: {
        userId,
        latitude,
        longitude,
        status: status || 'Available',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return location;
  }

  async getLocation(userId: string) {
    const location = await this.prisma.location.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return location;
  }

  async getFriendsLocations(userId: string) {
    // Get all friends of the user
    const friendships = await this.prisma.friendship.findMany({
      where: { userId },
      select: { friendId: true },
    });

    const friendIds = friendships.map((f) => f.friendId);

    // Get locations of all friends
    const locations = await this.prisma.location.findMany({
      where: {
        userId: { in: friendIds },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return locations;
  }

  async deleteLocation(userId: string) {
    await this.prisma.location.delete({
      where: { userId },
    });

    return { message: 'Location deleted' };
  }
}

