import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UpdateLocationDto } from './dto/location.dto';

@Controller('location')
@UseGuards(JwtAuthGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async updateLocation(@CurrentUser() user: any, @Body() dto: UpdateLocationDto) {
    return this.locationService.updateLocation(user.id, dto);
  }

  @Get('me')
  async getMyLocation(@CurrentUser() user: any) {
    return this.locationService.getLocation(user.id);
  }

  @Get('friends')
  async getFriendsLocations(@CurrentUser() user: any) {
    return this.locationService.getFriendsLocations(user.id);
  }

  @Get(':userId')
  async getLocation(@Param('userId') userId: string) {
    return this.locationService.getLocation(userId);
  }

  @Delete()
  async deleteLocation(@CurrentUser() user: any) {
    return this.locationService.deleteLocation(user.id);
  }
}

