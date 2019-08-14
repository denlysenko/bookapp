import { book } from '../../test-data/book';

export const MockBooksDataLoader = {
  load: jest.fn().mockImplementation(() => Promise.resolve(book)),
  create: jest.fn().mockReturnThis()
};
