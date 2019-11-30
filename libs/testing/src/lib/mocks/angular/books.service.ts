import { of } from 'rxjs';
import { book } from '../../test-data/book';

export const MockAngularBooksService = {
  create: jest.fn().mockImplementation(() => of({ data: book })),
  update: jest.fn().mockImplementation(() => of({ data: book })),
  getBooks: jest.fn().mockImplementation(() => ({
    valueChanges: of({ data: { books: { rows: [book], count: 1 } } }),
    refetch: jest.fn(),
    fetchMore: jest.fn()
  })),
  getBestBooks: jest.fn().mockImplementation(() => ({
    valueChanges: of({ data: { bestBooks: { rows: [book], count: 1 } } }),
    refetch: jest.fn(),
    fetchMore: jest.fn()
  })),
  rateBook: jest.fn().mockImplementation(() => of({})),
  getBook: jest.fn().mockImplementation(() => ({ valueChanges: of({ data: { book } }) })),
  addComment: jest.fn().mockImplementation(() => of({}))
};
