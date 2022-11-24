import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Updoot } from "./entities/Updoot";

export default {
  type: "postgres" as const,
  database: "gospelShareDB" as const,
  username: "postgres" as const,
  password: "postgres" as const,
  logging: true,
  synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, User, Updoot],
};
