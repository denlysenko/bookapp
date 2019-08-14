import { user } from '../../test-data/user';

export const MockUsersDataLoader = {
  load: jest.fn().mockImplementation(() => Promise.resolve(user)),
  create: jest.fn().mockReturnThis()
};
