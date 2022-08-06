import { User } from "src/entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class userObjectFields {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("inputValue") inputValue: userObjectFields,
    @Ctx() { em }: MyContext
  ) {
    const hashedPassword = await argon2.hash(inputValue.password);
    const newUser = await em.create(User, {
      username: inputValue.username,
      password: hashedPassword,
    });
    em.persistAndFlush(newUser);
    return newUser;
  }
}
