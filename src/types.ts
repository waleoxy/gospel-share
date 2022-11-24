import { Request, Response } from "express";
import { Redis } from "ioredis";
export type MyContext = {
  [x: string]: any;
  req: Request;
  res: Response;
  redis: Redis;
};
