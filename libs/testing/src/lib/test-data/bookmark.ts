import { BOOKMARKS } from '@bookapp/shared/models';

export const bookmark = {
  type: BOOKMARKS.FAVORITES,
  // TODO: use Book test data here
  book: {
    _id: 'book_id',
    title: 'Test Book'
  }
};
