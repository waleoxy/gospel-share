import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";

import { MyContext } from "./types";

import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { DataSource } from "typeorm";
import dataSourceConfig from "./dataSourceConfig";

export const appDataSource = new DataSource(dataSourceConfig);
//rerun
const main = async () => {
  appDataSource
    .initialize()
    .then((d) => {
      console.log("d", d.isConnected);
      d.runMigrations();
    })
    .catch((error) => console.log(error));

  const app = express();
  const port = 4000;

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  // const redisClient = createClient({ legacyMode: true });
  // await redisClient.connect().catch(console.error);

  app.set("trust proxy", !__prod__);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 60 * 24 * 365 * 5,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
        //secure: true,
      },
      saveUninitialized: false,
      secret: "keyboardcat",
      resave: false,
    })
  );

  const startServer = async () => {
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
      }),
      context: ({ req, res }): MyContext => ({ req, res, redis }),
    });
    await apolloServer.start();
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            embed: true,
            graphRef: "plaid-gufzoj@current",
          })
        : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ];
    apolloServer.applyMiddleware({
      app,
      cors: {
        origin: ["https://studio.apollographql.com", "http://localhost:3000"],
        credentials: true,
      },
    });
  };
  startServer();

  app.listen(port, () => {
    console.log("server listening on port: ", port);
  });
};

main().catch((err) => {
  console.error(err);
});
