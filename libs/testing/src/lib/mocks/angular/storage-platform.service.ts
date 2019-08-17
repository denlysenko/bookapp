export const MockStoragePlatformService = {
  getItem: jest.fn().mockImplementation(param => param),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
