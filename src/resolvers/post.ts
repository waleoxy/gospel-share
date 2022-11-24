import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { appDataSource } from "../index";
import { Updoot } from "../entities/Updoot";

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts!: Post[];
  @Field(() => Boolean)
  hasMore!: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 200);
  }

  @Mutation(() => Int)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;

    const currentValue = await Updoot.findOne({ where: { postId, userId } });
    console.log("cur", currentValue);
    const post_to_update = await Post.findOne({ where: { id: postId } });

    if (!currentValue) {
      await appDataSource
        .createQueryBuilder()
        .insert()
        .into(Updoot)
        .values({
          userId,
          postId,
          value: realValue,
        })
        .execute();
      Post.update(
        { id: postId },
        { points: post_to_update!.points + realValue }
      );
    } else if (
      currentValue &&
      currentValue.value !== value &&
      currentValue.userId !== userId
    ) {
      Post.update(
        { id: postId },
        { points: post_to_update!.points + value, voteStatus: value }
      );
    } else if (currentValue && currentValue.userId === userId) {
      Updoot.update({ userId, postId }, { value });
      if (currentValue.value !== realValue) {
        Post.update({ id: postId }, { points: post_to_update!.points + value });
      }
    } else {
      return null;
    }
    //
    return value;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit") limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    // @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(limit);
    const realLimitPlus = realLimit + 1;
    // const _userId = req.session.userId;

    const qb = appDataSource
      .getRepository(Post)
      .createQueryBuilder("post")
      .innerJoinAndSelect(
        "post.creator",
        "creator",
        'creator.id = post."creatorId"'
      )
      .orderBy("post.created_at", "DESC")
      .take(realLimitPlus);
    if (cursor) {
      qb.where("post.created_at < :cursor", {
        cursor: new Date(parseInt(cursor)),
      });
    }
    // if (_userId) {
    //   qb.update().set({ voteStatus: "post.points" });
    // }

    const posts = await qb.getMany();
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlus,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return Post.findOne({ where: { id }, relations: ["creator"] });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("title", () => String) title: string,
    @Arg("text", () => String) text: string,
    @Arg("pixUrl", () => String, { nullable: true }) pixUrl: string,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      title,
      text,
      pixUrl,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("text", () => String, { nullable: true }) text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await appDataSource
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where("id = :id and creatorId = :creatorId", {
        id: id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const post = await Post.findOne({ where: { id: id } });
    if (!post) {
      return false;
    }
    if (post.creatorId !== req.session.userId) {
      throw new Error("Not authorized");
    }
    await Updoot.delete({ postId: id });
    await Post.delete({ id });
    return true;
  }

  @Query(() => PaginatedPosts)
  async userPosts(
    @Arg("id", () => Int) id: number,
    @Arg("limit") limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    // @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(limit);
    const realLimitPlus = realLimit + 1;
    //const _userId = req.session.userId;

    const qb = appDataSource
      .getRepository(Post)
      .createQueryBuilder("post")
      .where(`post."creatorId" = ${id}`)
      .innerJoinAndSelect(
        "post.creator",
        "creator",
        'creator.id = post."creatorId"'
      )
      .orderBy("post.created_at", "DESC")
      .take(realLimitPlus);
    if (cursor) {
      qb.where("post.created_at < :cursor", {
        cursor: new Date(parseInt(cursor)),
      });
    }
    // if (_userId) {
    //   qb.update().set({ voteStatus: "post.points" });
    // }

    const posts = await qb.getMany();
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlus,
    };
  }
}
