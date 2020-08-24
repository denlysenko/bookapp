import { Schema } from 'mongoose';

export const LogSchema = new Schema({
  action: String,
  userId: Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bookId: Schema.Types.ObjectId,
});
