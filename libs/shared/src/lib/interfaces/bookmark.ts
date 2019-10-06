import { Book } from './book';

export interface Bookmark {
  _id: any;
  userId: string;
  type: string;
  bookId: string;
  book?: Book;
}

export interface BookmarkEvent {
  type: string;
  bookId: string;
}
