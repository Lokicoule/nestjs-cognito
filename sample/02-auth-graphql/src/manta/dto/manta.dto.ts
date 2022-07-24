import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MantaDto {
  @Field()
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}
