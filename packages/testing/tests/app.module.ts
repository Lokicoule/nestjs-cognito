import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoTestingModule } from "../lib";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CognitoTestingModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get("COGNITO_REGION"),
        userPoolId: configService.get("COGNITO_USER_POOL_ID"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TestingAppModule {}
