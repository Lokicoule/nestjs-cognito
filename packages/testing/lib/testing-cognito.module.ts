import { Module } from "@nestjs/common";
import { TestingCognitoController } from "./testing-cognito.controller";
import { TestingCognitoService } from "./testing-cognito.service";

@Module({
  controllers: [TestingCognitoController],
  providers: [TestingCognitoService],
})
export class TestingCognitoModule {}
