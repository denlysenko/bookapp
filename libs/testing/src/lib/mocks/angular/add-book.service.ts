import { of } from 'rxjs';
import { book } from '../../test-data/book';

export const MockAngularAddBookService = {
  create: jest.fn().mockImplementation(() => of({ data: book })),
  update: jest.fn().mockImplementation(() => of({ data: book })),
};
