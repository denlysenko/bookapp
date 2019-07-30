import { authPayload } from '../../test-data/auth-payload';

export const MockAuthService = {
  login: jest.fn().mockImplementation(() => Promise.resolve(authPayload)),
  signup: jest.fn().mockImplementation(() => Promise.resolve(authPayload))
};
