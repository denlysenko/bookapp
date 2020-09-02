import { Book } from './book';

export interface Log {
  _id: any;
  action: string;
  userId: string;
  createdAt: number;
  bookId: string;
  book?: Book;
}
