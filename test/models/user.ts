import { Document, Schema, Model, model } from "mongoose";

export interface UserDoc extends Document {
  name: string;
}
export interface UserModel extends Model<UserDoc> {}

const schema = new Schema({
  name: { type: String, required: true }
});

export const User: UserModel = model<UserDoc, UserModel>("User", schema);
