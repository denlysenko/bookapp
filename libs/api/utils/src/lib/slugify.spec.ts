import { slugify } from './slugify';

describe('slugify', () => {
  it('should create slug', () => {
    expect(slugify('Author Name Book Title')).toEqual('author-name-book-title');
  });
});
