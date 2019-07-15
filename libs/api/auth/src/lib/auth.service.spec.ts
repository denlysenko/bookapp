import { ConfigService } from '@bookapp/api/config';
import { UsersService } from '@bookapp/api/users';
import {
  authPayload,
  MockConfigService,
  MockUsersService,
  user
} from '@bookapp/testing';

import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { AUTH_ERRORS } from './constants';

const email = 'test@test.com';
// tslint:disable-next-line: no-hardcoded-credentials
const password = 'password';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: MockUsersService
        },
        {
          provide: ConfigService,
          useValue: MockConfigService
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jest
      .spyOn(authService, 'createToken')
      .mockImplementation(() => authPayload.token);
  });

  describe('login()', () => {
    it('should return token', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(() =>
          Promise.resolve({ ...user, authenticate: () => true } as any)
        );

      expect(await authService.login(email, password)).toEqual(authPayload);
    });

    it('should return INCORRECT_EMAIL_ERR', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(() => Promise.resolve(null));

      try {
        await authService.login(email, password);
      } catch (error) {
        expect(error.message.message).toEqual(AUTH_ERRORS.INCORRECT_EMAIL_ERR);
      }
    });

    it('should return INCORRECT_PASSWORD_ERR', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(() =>
          Promise.resolve({ ...user, authenticate: () => false } as any)
        );

      try {
        await authService.login(email, password);
      } catch (error) {
        expect(error.message.message).toEqual(
          AUTH_ERRORS.INCORRECT_PASSWORD_ERR
        );
      }
    });
  });

  describe('signup()', () => {
    const userDto = {
      email,
      password,
      firstName: '',
      lastName: ''
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

  describe('validate()', () => {
    it('should return user', async () => {
      expect(await authService.validate({ id: 'id' })).toEqual(user);
    });

    it('should return null', async () => {
      jest
        .spyOn(usersService, 'findById')
        .mockImplementation(() => Promise.resolve(null));

      expect(await authService.validate({ id: 'id' })).toEqual(null);
    });
  });
});
