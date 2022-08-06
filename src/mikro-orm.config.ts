import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import "reflect-metadata";
import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

export default {
  migrations: {
    tableName: "mikro_orm_migrations", // name of database table with log of executed transactions
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    glob: "!(*.d).{js,ts}", // how to match migration files (all .js and .ts files, but not .d.ts)
  },
  metadataProvider: ReflectMetadataProvider,
  entities: [Post, User],
  dbName: "gospelShareDb",
  type: "postgresql",
  debug: !__prod__,
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
