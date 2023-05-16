import { Query, Resolver } from "@nestjs/graphql";
import { GqlAuthentication, GqlCognitoUser } from "../../lib";
import { UserDto } from "./dto/user.dto";

@Resolver()
@GqlAuthentication()
export class AuthResolver {
  @Query(() => UserDto)
  getMeFromPayload(@GqlCognitoUser(["username", "email", "groups"]) me) {
    return new UserDto(me.username, me.email, me.groups);
  }

  @Query(() => String)
  getEmailFromPayload(@GqlCognitoUser("email") email) {
    return email;
  }
}
