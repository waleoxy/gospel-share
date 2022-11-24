import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { UserObjectFields } from "./UserObjectFields";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { appDataSource } from "../index";

@ObjectType()
class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "password length must be greater than 2",
          },
        ],
      };
    }
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);

    const user = await User.findOne({ where: { id: userIdNum } });

    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "user no longer exists",
          },
        ],
      };
    }

    User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );
    await redis.del(key);

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 3600 * 24 * 3
    );
    await sendEmail(
      email,
      `<a href="localhost:3000/change-password/${token}">reset password</a>`
    );
    return true;
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await User.find();
    return users;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOne({ where: { id: req.session.userId } });
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id") id: number): Promise<User | null> {
    const user = await User.findOne({ where: { id } });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("inputValue") inputValue: UserObjectFields,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(inputValue);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(inputValue.password);

    let newUser;

    try {
      const res = await appDataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: inputValue.username,
          email: inputValue.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      newUser = res.raw[0];
    } catch (error: any) {
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "user",
              message: "username or email already exist",
            },
          ],
        };
      }
    }

    req.session.userId = newUser.id;
    return { user: newUser };
  }

  @Mutation(() => String)
  async deleteUser(@Arg("id") id: number): Promise<String | null> {
    const user = await User.findOne({ where: { id } });
    if (typeof user !== undefined) {
      await User.delete(id);
      return `msg: User ${user?.username} deleted`;
    }
    return "null";
  }

  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("id") id: number,
    @Arg("inputValue") inputValue: UserObjectFields
  ): Promise<UserResponse> {
    const user_to_update = await User.findOne({ where: { id } });
    if (!user_to_update) {
      return {
        errors: [
          {
            field: "username or password",
            message: "Check the supplied credentials",
          },
        ],
      };
    }
    if (
      typeof inputValue.password &&
      typeof inputValue.username !== undefined
    ) {
      const hashedPassword = await argon2.hash(inputValue.password);
      User.update(
        { id },
        { username: inputValue.username, password: hashedPassword }
      );
    }
    return { user: user_to_update };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          { field: "usernameOrEmail", message: "username does not exist" },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
