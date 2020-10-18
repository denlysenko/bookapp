import { convertToMongoSortQuery } from './convert-query';

describe('convertToMongoSortQuery', () => {
  it('should convert asc to 1', () => {
    expect(convertToMongoSortQuery('id_asc')).toEqual({ id: 1 });
  });

  it('should convert desc to -1', () => {
    expect(convertToMongoSortQuery('id_desc')).toEqual({ id: -1 });
  });
});
