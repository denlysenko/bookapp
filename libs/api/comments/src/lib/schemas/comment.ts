import { Schema } from 'mongoose';

export const CommentSchema = new Schema(
  {
    bookId: Schema.Types.ObjectId,
    authorId: Schema.Types.ObjectId,
    text: String,
  },
  {
    timestamps: true,
  }
);
