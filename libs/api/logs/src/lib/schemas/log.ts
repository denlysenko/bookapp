import { Schema } from 'mongoose';

export const LogSchema = new Schema(
  {
    action: String,
    userId: Schema.Types.ObjectId,
    bookId: Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);
