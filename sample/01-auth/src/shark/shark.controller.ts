import { AuthenticationGuard } from '@nestjs-cognito/auth';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('shark')
export class SharkController {
  @Get('blue')
  @UseGuards(AuthenticationGuard)
  getBlue() {
    return {
      message: 'Blue',
    };
  }
}
