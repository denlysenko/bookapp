import { user } from '../../test-data/user';

export const MockUsersService = {
  findByEmail: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve({ ...user, authenticate: () => true })
    ),
  findById: jest.fn().mockImplementation(() => Promise.resolve(user)),
  create: jest.fn().mockImplementation(() => Promise.resolve(user))
};
