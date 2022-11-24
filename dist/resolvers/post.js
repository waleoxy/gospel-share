"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const Post_1 = require("../entities/Post");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const index_1 = require("../index");
const Updoot_1 = require("../entities/Updoot");
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedPosts);
let PostResolver = class PostResolver {
    textSnippet(root) {
        return root.text.slice(0, 200);
    }
    async vote(postId, value, { req }) {
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;
        const { userId } = req.session;
        const currentValue = await Updoot_1.Updoot.findOne({ where: { postId, userId } });
        console.log("cur", currentValue);
        const post_to_update = await Post_1.Post.findOne({ where: { id: postId } });
        if (!currentValue) {
            await index_1.appDataSource
                .createQueryBuilder()
                .insert()
                .into(Updoot_1.Updoot)
                .values({
                userId,
                postId,
                value: realValue,
            })
                .execute();
            Post_1.Post.update({ id: postId }, { points: post_to_update.points + realValue });
        }
        else if (currentValue &&
            currentValue.value !== value &&
            currentValue.userId !== userId) {
            Post_1.Post.update({ id: postId }, { points: post_to_update.points + value, voteStatus: value });
        }
        else if (currentValue && currentValue.userId === userId) {
            Updoot_1.Updoot.update({ userId, postId }, { value });
            if (currentValue.value !== realValue) {
                Post_1.Post.update({ id: postId }, { points: post_to_update.points + value });
            }
        }
        else {
            return null;
        }
        return value;
    }
    async posts(limit, cursor) {
        const realLimit = Math.min(limit);
        const realLimitPlus = realLimit + 1;
        const qb = index_1.appDataSource
            .getRepository(Post_1.Post)
            .createQueryBuilder("post")
            .innerJoinAndSelect("post.creator", "creator", 'creator.id = post."creatorId"')
            .orderBy("post.created_at", "DESC")
            .take(realLimitPlus);
        if (cursor) {
            qb.where("post.created_at < :cursor", {
                cursor: new Date(parseInt(cursor)),
            });
        }
        const posts = await qb.getMany();
        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlus,
        };
    }
    post(id) {
        return Post_1.Post.findOne({ where: { id }, relations: ["creator"] });
    }
    async createPost(title, text, pixUrl, { req }) {
        return Post_1.Post.create({
            title,
            text,
            pixUrl,
            creatorId: req.session.userId,
        }).save();
    }
    async updatePost(id, title, text, { req }) {
        const result = await index_1.appDataSource
            .createQueryBuilder()
            .update(Post_1.Post)
            .set({ title, text })
            .where("id = :id and creatorId = :creatorId", {
            id: id,
            creatorId: req.session.userId,
        })
            .returning("*")
            .execute();
        return result.raw[0];
    }
    async deletePost(id, { req }) {
        const post = await Post_1.Post.findOne({ where: { id: id } });
        if (!post) {
            return false;
        }
        if (post.creatorId !== req.session.userId) {
            throw new Error("Not authorized");
        }
        await Updoot_1.Updoot.delete({ postId: id });
        await Post_1.Post.delete({ id });
        return true;
    }
    async userPosts(id, limit, cursor) {
        const realLimit = Math.min(limit);
        const realLimitPlus = realLimit + 1;
        const qb = index_1.appDataSource
            .getRepository(Post_1.Post)
            .createQueryBuilder("post")
            .where(`post."creatorId" = ${id}`)
            .innerJoinAndSelect("post.creator", "creator", 'creator.id = post."creatorId"')
            .orderBy("post.created_at", "DESC")
            .take(realLimitPlus);
        if (cursor) {
            qb.where("post.created_at < :cursor", {
                cursor: new Date(parseInt(cursor)),
            });
        }
        const posts = await qb.getMany();
        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlus,
        };
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textSnippet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_1.Int),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("value", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedPosts),
    __param(0, (0, type_graphql_1.Arg)("limit")),
    __param(1, (0, type_graphql_1.Arg)("cursor", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("title", () => String)),
    __param(1, (0, type_graphql_1.Arg)("text", () => String)),
    __param(2, (0, type_graphql_1.Arg)("pixUrl", () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("title", () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)("text", () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedPosts),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("limit")),
    __param(2, (0, type_graphql_1.Arg)("cursor", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "userPosts", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map