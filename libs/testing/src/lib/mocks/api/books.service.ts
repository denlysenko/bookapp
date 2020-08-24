import { book } from '../../test-data/book';

export const MockBooksService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve({ count: 1, rows: [book] })),
  findBySlug: jest.fn().mockImplementation(() => Promise.resolve(book)),
  findById: jest.fn().mockImplementation(() => Promise.resolve(book)),
  findBestBooks: jest.fn().mockImplementation(() => Promise.resolve({ count: 1, rows: [book] })),
  create: jest.fn().mockImplementation(() => Promise.resolve(book)),
  update: jest.fn().mockImplementation(() => Promise.resolve(book)),
  rateBook: jest.fn().mockImplementation(() => Promise.resolve(book)),
};
