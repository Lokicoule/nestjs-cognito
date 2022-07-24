import { Authentication } from '@nestjs-cognito/auth';
import { Controller, Get } from '@nestjs/common';

@Controller('dolphin')
@Authentication()
export class DolphinController {
  @Get('flipper')
  getFlipper() {
    return {
      message: 'Flipper',
    };
  }
}
