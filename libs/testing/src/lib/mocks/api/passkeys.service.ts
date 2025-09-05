import { authenticationOptions } from '../../test-data/authentication-options';
import { passkey } from '../../test-data/passkey';
import { user } from '../../test-data/user';

export const MockPasskeysService = {
  generateAuthenticationOptions: jest
    .fn()
    .mockImplementation(() => Promise.resolve(authenticationOptions)),
  verifyAuthenticationResponse: jest.fn().mockImplementation(() => Promise.resolve(user)),
  generateRegistrationOptions: jest
    .fn()
    .mockImplementation(() => Promise.resolve(authenticationOptions)),
  verifyRegistrationResponse: jest.fn().mockImplementation(() => Promise.resolve(passkey)),
  findAll: jest.fn().mockImplementation(() => Promise.resolve({ count: 1, rows: [passkey] })),
  update: jest.fn().mockImplementation(() => Promise.resolve(passkey)),
  delete: jest.fn().mockImplementation(() => Promise.resolve(true)),
};
