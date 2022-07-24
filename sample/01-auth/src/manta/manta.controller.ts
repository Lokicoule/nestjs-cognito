import { Authorization } from '@nestjs-cognito/auth';
import { Controller, Get } from '@nestjs/common';

@Controller('manta')
@Authorization({
  requiredGroups: ['manta'],
  prohibitedGroups: ['dolphin', 'shark', 'whale'],
})
export class MantaController {
  @Get('ray')
  getRay() {
    return {
      message: 'Ray',
    };
  }
}
