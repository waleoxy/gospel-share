import { Field, ObjectType } from "type-graphql";
import { Entity, BaseEntity, ManyToOne, Column, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Field()
  @Column({ type: "int" })
  value!: number;

  @Field()
  @PrimaryColumn()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots)
  user!: User;

  @Field()
  @PrimaryColumn({ type: "int", default: 0 })
  postId!: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.updoots)
  post!: Post;
}
