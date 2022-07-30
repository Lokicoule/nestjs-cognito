import { CurrentUser, User } from "@nestjs-cognito/auth";
import { Controller, Get } from "@nestjs/common";
import { Authentication } from "../../lib";

@Controller("auth")
@Authentication()
export class AuthController {
  @Get("me")
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
