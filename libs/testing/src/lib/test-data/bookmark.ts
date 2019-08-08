import { BOOKMARKS } from '@bookapp/shared/models';
import { book } from './book';

export const bookmark = {
  type: BOOKMARKS.FAVORITES,
  book
};
