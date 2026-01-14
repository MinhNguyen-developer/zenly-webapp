import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationGateway } from './location.gateway';
import { PrismaService } from '../prisma.service';
import { FriendsModule } from '../friends/friends.module';

@Module({
  imports: [
    forwardRef(() => FriendsModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LocationController],
  providers: [
    LocationService,
    LocationGateway,
    PrismaService,
    {
      provide: 'LocationGateway',
      useExisting: LocationGateway,
    },
  ],
  exports: [LocationService, LocationGateway, 'LocationGateway'],
})
export class LocationModule {}

