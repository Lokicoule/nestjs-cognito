import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoTestingModule } from "../../../testing/lib/cognito-testing.module";
import { CognitoAuthModule } from "../../lib";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get("COGNITO_USER_POOL_ID") as string,
          clientId: configService.get("COGNITO_CLIENT_ID"),
          tokenUse: "id",
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
  controllers: [AuthController],
})
export class AuthModule {}
