import { Authentication, CurrentUser } from '@nestjs-cognito/graphql';
import { Query, Resolver } from '@nestjs/graphql';
import { UserDto } from './dto/user.dto';

@Resolver()
@Authentication()
export class AuthResolver {
  @Query(() => UserDto)
  getMe(@CurrentUser() me) {
    return new UserDto(me.username, me.email, me.groups);
  }
}
