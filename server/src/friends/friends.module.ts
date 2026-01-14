import { Module, forwardRef } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { PrismaService } from '@/prisma.service';
import { LocationModule } from '@/location/location.module';

@Module({
  imports: [forwardRef(() => LocationModule)],
  controllers: [FriendsController],
  providers: [FriendsService, PrismaService],
  exports: [FriendsService],
})
export class FriendsModule {}

