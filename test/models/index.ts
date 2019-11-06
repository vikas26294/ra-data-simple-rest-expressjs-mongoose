import * as mongoose from "mongoose";
export * from "./user";

export const connect = (url: string) => {
  return mongoose.connect(url);
};

export const connection = mongoose.connection;
