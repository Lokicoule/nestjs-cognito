import { UnauthorizedException } from "@nestjs/common";
import { UserBuilder } from "./user.builder";
import { User } from "./user.model";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

export class UserMapper {
  public static errors = {
    username: "User must have an username",
  };

  public static fromCognitoJwtPayload(payload: CognitoJwtPayload): User {
    const username = payload["cognito:username"]?.toString() ?? null;
    const email = payload["email"]?.toString() ?? null;

    if (!Boolean(username)) {
      throw new UnauthorizedException(this.errors["username"]);
    }

    return new UserBuilder()
      .setUsername(username)
      .setEmail(email)
      .setGroups(payload["cognito:groups"] ?? [])
      .build();
  }
}
