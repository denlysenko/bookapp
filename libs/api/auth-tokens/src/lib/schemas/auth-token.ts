import { Schema } from 'mongoose';

export const AuthTokenSchema = new Schema({
  userId: Schema.Types.ObjectId,
  token: String,
});
