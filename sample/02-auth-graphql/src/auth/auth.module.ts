import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';

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
  providers: [AuthResolver],
})
export class AuthModule {}
