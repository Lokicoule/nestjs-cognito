import { Authentication, CurrentUser, User } from '@nestjs-cognito/auth';
import { Controller, Get } from '@nestjs/common';

@Controller('auth')
@Authentication()
export class AuthController {
  @Get('me')
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
