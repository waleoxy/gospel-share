import { Field, InputType } from "type-graphql";

@InputType()
export class UserObjectFields {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}
