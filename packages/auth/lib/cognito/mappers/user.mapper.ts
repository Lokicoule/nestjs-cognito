import {
  AttributeType,
  GetUserResponse,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserBuilder } from "../../user/user.builder";
import { GroupsMapper } from "./groups.mapper";
import { User } from "../../user/user.model";
import { UnauthorizedException } from "@nestjs/common";

export class UserMapper {
  public static errors = {
    username: "User must have an username",
    email: "User must have an email",
    both: "User must have an username and an email",
  };

  /**
   * Map Cognito user to user.
   * @param {GetUserResponse} user
   * @param {null | Record<string, any> | string} payload
   * @returns {User}
   */
  public static fromGetUserAndDecodedJwt(
    user: GetUserResponse,
    payload: null | Record<string, any> | string
  ): User {
    return this.builderFromGetUser(user)
      .setGroups(GroupsMapper.fromDecodedJwt(payload))
      .build();
  }

  /**
   * Create a user builder from a Cognito user.
   * @param {GetUserResponse} user
   * @returns {UserBuilder}
   */
  private static builderFromGetUser(user: GetUserResponse) {
    const { UserAttributes, Username } = user;

    const email = this.getEmailFromUserAttributes(UserAttributes);

    if (!Boolean(Username) && Boolean(email)) {
      throw new UnauthorizedException(this.errors["username"]);
    } else if (!Boolean(email) && Boolean(Username)) {
      throw new UnauthorizedException(this.errors["email"]);
    } else if (!Boolean(Username) && !Boolean(email)) {
      throw new UnauthorizedException(this.errors["both"]);
    }

    return new UserBuilder().setUsername(Username).setEmail(email);
  }

  private static getEmailFromUserAttributes(userAttributes: AttributeType[]) {
    return userAttributes.find(
      (attribute: AttributeType) => attribute.Name === "email"
    )?.Value;
  }
}
