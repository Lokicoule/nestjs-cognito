import { Authentication, CurrentUser, CognitoUser, User } from "../../lib";
import { Controller, Get } from "@nestjs/common";

@Controller("auth")
@Authentication()
export class AuthController {
  @Get("me")
  getMe(@CurrentUser() user: User): User {
    return user;
  }

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
    }
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
    email: string
  ) {
    return email;
  }
}
