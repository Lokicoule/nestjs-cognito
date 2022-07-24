import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WhaleDto {
  @Field()
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}
