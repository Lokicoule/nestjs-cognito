import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoTestingModule } from "../../../testing/lib/cognito-testing.module";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get("COGNITO_REGION"),
      }),
      inject: [ConfigService],
    }),
    CognitoTestingModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get("COGNITO_REGION"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
