import { Authentication, CognitoUser } from '@nestjs-cognito/auth';
import { Controller, Get } from '@nestjs/common';

@Controller('auth')
@Authentication()
export class AuthController {
  @Get('me')
  getMe(@CognitoUser(['groups', 'username', 'email']) user) {
    return user;
  }
}
