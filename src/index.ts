import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

const main = async () => {
  const orm = await MikroORM.init({
    entities = [Post],
    dbName: "gospelShareDb",
    type: "postgresql",
    debug: !__prod__,
  });
  console.log("Hey! Hello, Typescript");
};
main();
