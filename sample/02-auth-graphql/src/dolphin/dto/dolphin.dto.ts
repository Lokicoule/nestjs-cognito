import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DolphinDto {
  @Field()
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}
