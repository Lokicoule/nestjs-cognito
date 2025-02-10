import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { CognitoTestingService } from "./cognito-testing.service";
import type { MockConfig } from "./types";

@Controller()
export class CognitoTestingController {
  constructor(private readonly cognitoTestingService: CognitoTestingService) {}

  @Post("cognito-testing-login")
  @HttpCode(200)
  async login(@Body() body: Record<string, string>) {
    const token = await this.cognitoTestingService.getAccessToken(
      {
        username: body.username,
        password: body.password,
      },
      body.clientId
    );

    return token;
  }

  @Post("config")
  @HttpCode(200)
  setMockConfig(@Body() config: MockConfig) {
    this.cognitoTestingService.setMockConfig(config);
    return { success: true };
  }
}
