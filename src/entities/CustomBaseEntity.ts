import { PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

export abstract class CustomBaseEntity {
  @PrimaryKey()
  id = Number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
