import { Schema } from 'mongoose';

import { BOOKMARKS } from '@bookapp/shared';

export const BookmarkSchema = new Schema({
  bookId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: [BOOKMARKS.MUSTREAD, BOOKMARKS.WISHLIST, BOOKMARKS.FAVORITES],
  },
});
