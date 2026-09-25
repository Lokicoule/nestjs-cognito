import type { CognitoJwtPayload } from "@nestjs-cognito/core";
import { UnauthorizedException } from "@nestjs/common";
import { UserBuilder } from "./user.builder";
import { User } from "./user.model";

export class UserMapper {
  private static readonly ERRORS = {
    USERNAME: "User must have a username or client ID",
  };

  public static fromCognitoJwtPayload(payload: CognitoJwtPayload): User {
    const username = payload["cognito:username"] || payload["username"];
    const clientId = payload["client_id"]?.toString();
    const isClientCredentialsFlow =
      payload["token_use"] === "access" && payload["scope"] && clientId;

    if (!username && !isClientCredentialsFlow) {
      throw new UnauthorizedException(UserMapper.ERRORS.USERNAME);
    }

    const builder = new UserBuilder()
      .setPayload(payload)
      .setEmail(payload["email"]?.toString() ?? null)
      .setGroups(this.extractGroups(payload))
      .setScopes(payload["scope"]?.toString().split(" ").filter(Boolean) ?? []);
    if (username) builder.setUsername(username.toString());
    if (clientId) builder.setClientId(clientId);

    return builder.build();
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
