import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoTestingModule } from "../lib";

@Module({
  imports: [
    ConfigModule.forRoot(),
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
})
export class TestingAppModule {}
