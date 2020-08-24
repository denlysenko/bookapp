import { authPayload } from '../../test-data/auth-payload';
import { user } from '../../test-data/user';

export const MockUsersService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve({ count: 1, rows: [user] })),
  findByEmail: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ ...user, authenticate: () => true })),
  findById: jest.fn().mockImplementation(() => Promise.resolve(user)),
  create: jest.fn().mockImplementation(() => Promise.resolve(user)),
  update: jest.fn().mockImplementation(() => Promise.resolve(user)),
  changePassword: jest.fn().mockImplementation(() => Promise.resolve(authPayload)),
  requestResetPassword: jest.fn().mockImplementation(() => Promise.resolve('token')),
  resetPassword: jest.fn().mockImplementation(() => Promise.resolve(true)),
  remove: jest.fn().mockImplementation(() => Promise.resolve(user)),
};
