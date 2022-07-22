import { Body, Controller, Post } from "@nestjs/common";
import { TestingCognitoService } from "./testing-cognito.service";

@Controller()
export class TestingCognitoController {
  constructor(private readonly authService: TestingCognitoService) {}

  @Post("login")
  login(@Body() body: Record<string, string>) {
    return this.authService.getAccessToken(
      {
        username: body.username,
        password: body.password,
      },
      body.clientId
    );
  }
}
