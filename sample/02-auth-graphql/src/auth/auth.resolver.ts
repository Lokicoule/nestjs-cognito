import { Authentication, CognitoUser } from '@nestjs-cognito/graphql';
import { Query, Resolver } from '@nestjs/graphql';
import { UserDto } from './dto/user.dto';

@Resolver()
@Authentication()
export class AuthResolver {
  @Query(() => UserDto)
  getMe(@CognitoUser() me) {
    return new UserDto(me.username, me.email, me.groups);
  }

  @Query(() => UserDto)
  getMeBis(@CognitoUser(['username', 'email', 'groups']) me) {
    return new UserDto(me.username, me.email, me.groups);
  }
}
