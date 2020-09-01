import { of } from 'rxjs';
import { book } from '../../test-data/book';

export const MockAngularBestBooksService = {
  watchBooks: jest
    .fn()
    .mockImplementation(() => of({ data: { bestBooks: { rows: [book], count: 1 } } })),
  rateBook: jest.fn().mockImplementation(() => of({})),
  loadMore: jest.fn(),
};
