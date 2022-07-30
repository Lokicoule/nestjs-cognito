import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Response {
  @Field()
  message: string;
}
