import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field()
  readonly username: string;

  @Field()
  readonly email: string;

  @Field(() => [String])
  readonly groups: string[];

  constructor(username: string, email: string, groups: string[]) {
    this.username = username;
    this.email = email;
    this.groups = groups;
  }
}
