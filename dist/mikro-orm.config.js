"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const path_1 = __importDefault(require("path"));
const User_1 = require("./entities/User");
exports.default = {
    migrations: {
        tableName: "mikro_orm_migrations",
        path: path_1.default.join(__dirname, "./migrations"),
        glob: "!(*.d).{js,ts}",
    },
    metadataProvider: core_1.ReflectMetadataProvider,
    entities: [Post_1.Post, User_1.User],
    dbName: "gospelShareDb",
    type: "postgresql",
    debug: !constants_1.__prod__,
    allowGlobalContext: true,
};
//# sourceMappingURL=mikro-orm.config.js.map