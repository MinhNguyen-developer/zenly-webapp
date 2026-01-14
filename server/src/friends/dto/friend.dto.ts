import { IsString } from 'class-validator';

export class SendFriendRequestDto {
  @IsString()
  receiverId: string;
}

export class RespondFriendRequestDto {
  @IsString()
  requestId: string;

  @IsString()
  action: 'accept' | 'reject';
}

