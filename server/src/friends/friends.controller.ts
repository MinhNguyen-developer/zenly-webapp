import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {FriendsService} from './friends.service';
import {JwtAuthGuard} from '@/common/guards/jwt-auth.guard';
import {CurrentUser} from '@/common/decorators/current-user.decorator';
import {SendFriendRequestDto} from './dto/friend.dto';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  async sendFriendRequest(
    @CurrentUser() user: any,
    @Body() dto: SendFriendRequestDto,
  ) {
    return this.friendsService.sendFriendRequest(user.id, dto);
  }

  @Post('request/:requestId/accept')
  async acceptFriendRequest(
    @CurrentUser() user: any,
    @Param('requestId') requestId: string,
  ) {
    return this.friendsService.acceptFriendRequest(user.id, requestId);
  }

  @Post('request/:requestId/reject')
  async rejectFriendRequest(
    @CurrentUser() user: any,
    @Param('requestId') requestId: string,
  ) {
    return this.friendsService.rejectFriendRequest(user.id, requestId);
  }

  @Get('requests/pending')
  async getPendingRequests(@CurrentUser() user: any) {
    return this.friendsService.getPendingRequests(user.id);
  }

  @Get('requests/sent')
  async getSentRequests(@CurrentUser() user: any) {
    return this.friendsService.getSentRequests(user.id);
  }

  @Get()
  async getFriends(@CurrentUser() user: any) {
    return this.friendsService.getFriends(user.id);
  }

  @Delete(':friendId')
  async removeFriend(
    @CurrentUser() user: any,
    @Param('friendId') friendId: string,
  ) {
    return this.friendsService.removeFriend(user.id, friendId);
  }
}

