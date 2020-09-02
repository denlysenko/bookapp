import { BOOKMARKS } from '@bookapp/shared/enums';
import { book } from './book';

export const bookmark = {
  type: BOOKMARKS.FAVORITES,
  book,
};
