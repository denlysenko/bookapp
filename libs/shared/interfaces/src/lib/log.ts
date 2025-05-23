import { Book } from './book';

export interface Log {
  id: string;
  action: string;
  userId: string;
  createdAt: number;
  bookId: string;
  book?: Book;
}
