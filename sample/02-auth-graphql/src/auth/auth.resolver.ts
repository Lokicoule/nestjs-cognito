import { GqlAuthentication, GqlCognitoUser } from '@nestjs-cognito/graphql';
import { Query, Resolver } from '@nestjs/graphql';
import { UserDto } from './dto/user.dto';

@Resolver()
@GqlAuthentication()
export class AuthResolver {
  @Query(() => UserDto)
  getMe(@GqlCognitoUser() me) {
    return new UserDto(me.username, me.email, me.groups);
  }

  @Query(() => UserDto)
  getMeBis(@GqlCognitoUser(['username', 'email', 'groups']) me) {
    return new UserDto(me.username, me.email, me.groups);
  }
}
