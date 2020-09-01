import { of } from 'rxjs';
import { book } from '../../test-data/book';

export const MockAngularBookService = {
  watchBook: jest.fn().mockImplementation(() => of({ data: { book } })),
  addComment: jest.fn().mockImplementation(() => of({})),
  rateBook: jest.fn().mockImplementation(() => of({})),
};
