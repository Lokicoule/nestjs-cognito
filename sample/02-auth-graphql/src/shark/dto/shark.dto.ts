import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SharkDto {
  @Field()
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}
