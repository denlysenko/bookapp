import { Book } from './book';

export interface Bookmark {
  id: string;
  userId: string;
  type: string;
  bookId: string;
  book?: Book;
}

export interface BookmarkEvent {
  type: string;
  bookId: string;
}
