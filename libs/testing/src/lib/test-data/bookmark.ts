import { BOOKMARKS } from '@bookapp/shared';
import { book } from './book';

export const bookmark = {
  type: BOOKMARKS.FAVORITES,
  book
};
