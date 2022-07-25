import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    CognitoAuthModule.register({
      region: "eu-west-1",
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
