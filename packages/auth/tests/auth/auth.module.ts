import { CognitoModuleOptions } from "@nestjs-cognito/core";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoTestingModule } from "../../../testing/lib/cognito-testing.module";
import { CognitoAuthModule } from "../../lib";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) =>
        ({
          region: configService.get("COGNITO_REGION"),
          userPoolId: configService.get("COGNITO_USER_POOL_ID"),
          clientId: configService.get("COGNITO_CLIENT_ID"),
          tokenUse: "id",
        } as CognitoModuleOptions),
      inject: [ConfigService],
    }),
    CognitoTestingModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) =>
        ({
          region: configService.get("COGNITO_REGION"),
          userPoolId: configService.get("COGNITO_USER_POOL_ID"),
          clientId: configService.get("COGNITO_CLIENT_ID"),
        } as CognitoModuleOptions),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
