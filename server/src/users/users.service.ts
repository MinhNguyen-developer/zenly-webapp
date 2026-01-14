import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(searchQuery?: string) {
    const where = searchQuery
      ? {
          OR: [
            { username: { contains: searchQuery, mode: 'insensitive' as any } },
            { name: { contains: searchQuery, mode: 'insensitive' as any } },
            { email: { contains: searchQuery, mode: 'insensitive' as any } },
          ],
        }
      : {};

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        email: true,
      },
      take: 50,
    });
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        email: true,
        createdAt: true,
        location: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        email: true,
        location: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}

