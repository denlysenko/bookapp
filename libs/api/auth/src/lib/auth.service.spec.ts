import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { AUTH_ERRORS } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import {
  authPayload,
  MockAuthTokensService,
  MockConfigService,
  MockUsersService,
  refreshToken,
  user,
} from '@bookapp/testing/api';

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';

const email = 'test@test.com';
const password = 'password';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let authTokensService: AuthTokensService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: MockUsersService,
        },
        {
          provide: ConfigService,
          useValue: MockConfigService,
        },
        {
          provide: AuthTokensService,
          useValue: MockAuthTokensService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    authTokensService = module.get<AuthTokensService>(AuthTokensService);
  });

  describe('login()', () => {
    it('should return tokens', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation(() => Promise.resolve({ ...user, authenticate: () => true } as any));

      expect(await authService.login(email, password)).toEqual(authPayload);
    });

    it('should return INCORRECT_EMAIL_ERR', async () => {
      jest.spyOn(usersService, 'findByEmail').mockImplementation(() => Promise.resolve(null));

      try {
        await authService.login(email, password);
      } catch (error) {
        expect(error.message).toEqual(AUTH_ERRORS.INCORRECT_EMAIL_OR_PASSWORD_ERR);
      }
    });

    it('should return INCORRECT_PASSWORD_ERR', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation(() => Promise.resolve({ ...user, authenticate: () => false } as any));

      try {
        await authService.login(email, password);
      } catch (error) {
        expect(error.message).toEqual(AUTH_ERRORS.INCORRECT_EMAIL_OR_PASSWORD_ERR);
      }
    });
  });

  describe('signup()', () => {
    const userDto = {
      email,
      password,
      firstName: '',
      lastName: '',
    };

    it('should return token', async () => {
      expect(await authService.signup(userDto)).toEqual(authPayload);
    });

    it('should return Validation Error', async () => {
      jest
        .spyOn(usersService, 'create')
        .mockImplementation(() => Promise.reject({ name: 'ValidationError' }));

      try {
        await authService.signup(userDto);
      } catch (error) {
        expect(error.name).toEqual('ValidationError');
      }
    });
  });

  describe('logout()', () => {
    it('should remove refresh token', async () => {
      await authService.logout(refreshToken);
      expect(authTokensService.removeRefreshToken).toHaveBeenCalledWith(refreshToken);
    });
  });
});
