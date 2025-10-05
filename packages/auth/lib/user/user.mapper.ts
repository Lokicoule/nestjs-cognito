import type { CognitoJwtPayload } from "@nestjs-cognito/core";
import { UnauthorizedException } from "@nestjs/common";
import { UserBuilder } from "./user.builder";
import { User } from "./user.model";

export class UserMapper {
  private static readonly ERRORS = {
    USERNAME: "User must have a username or client ID",
  };

  public static fromCognitoJwtPayload(
    payload: CognitoJwtPayload,
  ): User {
    const username = payload["cognito:username"] || payload["username"] || null;
    const clientId = payload["client_id"]?.toString() || null;
    const email = payload["email"]?.toString() ?? null;
    const isClientCredentialsFlow = payload["token_use"] === "access" && payload["scope"] && clientId;

    if (isClientCredentialsFlow) {
      const groups = this.extractGroups(payload);
      return new UserBuilder()
        .setClientId(clientId)
        .setEmail(email)
        .setGroups(groups)
        .build();
    }

    if (!(username)) {
      throw new UnauthorizedException(UserMapper.ERRORS.USERNAME);
    }

    const groups = this.extractGroups(payload);

    return new UserBuilder()
      .setUsername(username.toString())
      .setEmail(email)
      .setGroups(groups)
      .build();
  }

  private static extractGroups(payload: CognitoJwtPayload): string[] {
    const payloadGroups = payload["cognito:groups"] || payload["groups"];

    if (Array.isArray(payloadGroups)) {
      return payloadGroups.map((group) => group.toString());
    } else if (payloadGroups) {
      return [payloadGroups.toString()];
    }
    return [];
  }
}