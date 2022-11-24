"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const apollo_server_core_1 = require("apollo-server-core");
const typeorm_1 = require("typeorm");
const dataSourceConfig_1 = __importDefault(require("./dataSourceConfig"));
exports.appDataSource = new typeorm_1.DataSource(dataSourceConfig_1.default);
const main = async () => {
    exports.appDataSource
        .initialize()
        .then((d) => {
        console.log("d", d.isConnected);
        d.runMigrations();
    })
        .catch((error) => console.log(error));
    const app = (0, express_1.default)();
    const port = 4000;
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default();
    app.set("trust proxy", !constants_1.__prod__);
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({ client: redis, disableTouch: true }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 60 * 24 * 365 * 5,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: "keyboardcat",
        resave: false,
    }));
    const startServer = async () => {
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: await (0, type_graphql_1.buildSchema)({
                resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
                validate: false,
            }),
            context: ({ req, res }) => ({ req, res, redis }),
        });
        await apolloServer.start();
        plugins: [
            process.env.NODE_ENV === "production"
                ? (0, apollo_server_core_1.ApolloServerPluginLandingPageProductionDefault)({
                    embed: true,
                    graphRef: "plaid-gufzoj@current",
                })
                : (0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true }),
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
//# sourceMappingURL=index.js.map