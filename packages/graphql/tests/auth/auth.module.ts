import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoTestingModule } from "../../../testing/lib/cognito-testing.module";
import { AuthResolver } from "./auth.resolver";

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get("COGNITO_USER_POOL_ID"),
          tokenUse: "id",
          clientId: configService.get("COGNITO_CLIENT_ID"),
        },
      }),
      inject: [ConfigService],
    }),
    CognitoTestingModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        identityProvider: {
          region: configService.get("COGNITO_REGION"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthResolver],
})
export class AuthModule {}
