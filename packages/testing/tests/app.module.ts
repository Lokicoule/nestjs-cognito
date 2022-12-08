import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CognitoTestingModule } from "../lib";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CognitoTestingModule.register({
      region: process.env.COGNITO_REGION ?? "eu-west-1",
    }),
  ],
})
export class TestingAppModule {}
