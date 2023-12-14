import { Controller, Get } from "@nestjs/common";
import { Authentication, CognitoUser } from "../../lib";
import { PublicRoute } from "../../lib";

@Controller("auth")
@Authentication()
export class AuthController {
  @Get("me-from-payload")
  getMeFromPayload(
    @CognitoUser(["username", "email", "groups"])
    {
      username,
      email,
      groups,
    }: {
      username: string;
      email: string;
      groups: string[];
    },
  ) {
    return {
      username,
      email,
      groups,
    };
  }

  @Get("email-from-payload")
  getEmailFromPayload(
    @CognitoUser("email")
    email: string,
  ) {
    return email;
  }

  @Get("iampublic")
  @PublicRoute()
  getPublic() {
    return "public";
  }
}
