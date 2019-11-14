import { Document, Schema, Model, model } from "mongoose";

interface UserDoc extends Document {
  name: string;
  username: string;
  password: string;
}
interface UserModel extends Model<UserDoc> {}

const schema = new Schema({
  name: { type: String },
  username: { type: String, required: true },
  password: { type: String, required: true, select: false }
});

export const User: UserModel = model<UserDoc, UserModel>("User", schema);
