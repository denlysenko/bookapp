import { extractFileKey } from './extract-file-key';

describe('extractFileKey', () => {
  it('should extract key from url with query params', () => {
    expect(extractFileKey('file_key?alt=media')).toEqual('file_key');
  });

  it('should extract key from url without query params', () => {
    expect(extractFileKey('file_key')).toEqual('file_key');
  });
});
