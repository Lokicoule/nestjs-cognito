import { Authentication, CognitoUser, CurrentUser } from "../../lib";
import { Query, Resolver } from "@nestjs/graphql";
import { UserDto } from "./dto/user.dto";

@Resolver()
@Authentication()
export class AuthResolver {
  @Query(() => UserDto)
  getMe(@CurrentUser() me) {
    return new UserDto(me.username, me.email, me.groups);
  }

  @Query(() => UserDto)
  getMeFromPayload(@CognitoUser(["username", "email", "groups"]) me) {
    return new UserDto(me.username, me.email, me.groups);
  }

  @Query(() => String)
  getEmailFromPayload(@CognitoUser("email") email) {
    return email;
  }
}
