"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const path_1 = __importDefault(require("path"));
const Updoot_1 = require("./entities/Updoot");
exports.default = {
    type: "postgres",
    database: "gospelShareDB",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path_1.default.join(__dirname, "./migrations/*")],
    entities: [Post_1.Post, User_1.User, Updoot_1.Updoot],
};
//# sourceMappingURL=dataSourceConfig.js.map