import { Body, Controller, Post } from "@nestjs/common";
import { CognitoTestingService } from "./cognito-testing.service";

@Controller()
export class CognitoTestingController {
  constructor(private readonly authService: CognitoTestingService) {}

  @Post("cognito-testing-login")
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
