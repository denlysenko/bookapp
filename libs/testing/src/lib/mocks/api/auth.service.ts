import { authPayload } from '../../test-data/auth-payload';

export const MockAuthService = jest.fn().mockImplementation(() => {
  return {
    login: () => Promise.resolve(authPayload),
    signup: () => Promise.resolve(authPayload)
  };
});
