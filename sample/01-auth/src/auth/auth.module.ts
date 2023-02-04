import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: 'us-east-1_123456789',
        clientId: '1234567890123456789012',
        tokenUse: 'id',
      },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
