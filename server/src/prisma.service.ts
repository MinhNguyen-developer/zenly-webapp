import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import prismaClient, {adapter, PrismaClient} from '../prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({adapter})
  }

  async onModuleInit() {
    await prismaClient.$connect();
  }

  async onModuleDestroy() {
    await prismaClient.$disconnect();
  }
}
