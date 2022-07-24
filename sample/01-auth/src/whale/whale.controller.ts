import { AuthorizationGuard } from '@nestjs-cognito/auth';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('whale')
export class WhaleController {
  @Get('moby')
  @UseGuards(AuthorizationGuard(['admin', 'whale']))
  getMoby() {
    return {
      message: 'Moby',
    };
  }
}
