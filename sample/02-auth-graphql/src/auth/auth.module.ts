import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    CognitoAuthModule.register({
      region: 'eu-west-1',
    }),
  ],
  providers: [AuthResolver],
})
export class AuthModule {}
