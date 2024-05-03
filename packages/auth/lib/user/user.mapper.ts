import { UnauthorizedException } from "@nestjs/common";
import { UserBuilder } from "./user.builder";
import { User } from "./user.model";

import type { CognitoJwtPayload, JwtPayload } from "aws-jwt-verify/jwt-model";

export class UserMapper {
  private static readonly ERRORS = {
    USERNAME: "User must have a username",
  };

  public static fromCognitoJwtPayload(
    payload: JwtPayload | CognitoJwtPayload,
  ): User {
    const username = payload["cognito:username"] || payload["username"] || null;
    const email = payload["email"]?.toString() ?? null;

    if (!username) {
      throw new UnauthorizedException(UserMapper.ERRORS.USERNAME);
    }

    let groups: string[] = [];
    const payloadGroups = payload["cognito:groups"] || payload["groups"];

    if (Array.isArray(payloadGroups)) {
      groups = payloadGroups.map((group) => group.toString());
    } else if (payloadGroups) {
      groups = [payloadGroups.toString()];
    }

    return new UserBuilder()
      .setUsername(username.toString())
      .setEmail(email)
      .setGroups(groups)
      .build();
  }
}
