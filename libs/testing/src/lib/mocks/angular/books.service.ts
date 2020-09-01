import { of } from 'rxjs';
import { book } from '../../test-data/book';

export const MockAngularBooksService = {
  watchBooks: jest
    .fn()
    .mockImplementation(() => of({ data: { books: { rows: [book], count: 1 } } })),
  loadMore: jest.fn(),
  refetch: jest.fn(),
  rateBook: jest.fn().mockImplementation(() => of({})),
};
