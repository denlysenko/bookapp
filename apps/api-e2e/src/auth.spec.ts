import { AUTH_ERRORS, AuthModule, AuthService } from '@bookapp/api/auth';
import { ConfigModule, ConfigService } from '@bookapp/api/config';
import { GraphqlModule } from '@bookapp/api/graphql';
import {
  USER_MODEL_NAME,
  USER_VALIDATION_ERRORS,
  UsersService
} from '@bookapp/api/users';
import {
  authPayload,
  MockConfigService,
  MockModel,
  MockUsersService
} from '@bookapp/testing';

import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { ValidationError } from 'mongoose/lib/error';
import * as request from 'supertest';

const validationError = new ValidationError();
validationError.errors = {
  lastName: {
    message: USER_VALIDATION_ERRORS.LAST_NAME_REQUIRED_ERR
  },
  firstName: {
    message: USER_VALIDATION_ERRORS.FIRST_NAME_REQUIRED_ERR
  },
  email: {
    message: USER_VALIDATION_ERRORS.EMAIL_REQUIRED_ERR
  }
};

describe('AuthModule', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, AuthModule, GraphqlModule]
    })
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(getModelToken(USER_MODEL_NAME))
      .useValue(MockModel)
      .overrideProvider(UsersService)
      .useValue(MockUsersService)
      .compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);

    jest.spyOn(authService, 'createToken').mockReturnValue(authPayload.token);

    app = module.createNestApplication();
    await app.init();
  });

  describe('login()', () => {
    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            login(email: "test@test.com", password: "password") {
              token
            }
          }`
        })
        .expect({
          data: {
            login: authPayload
          }
        });
    });

    it('should not login if email is not found', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementationOnce(() => Promise.resolve(null));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation { 
            login(email: "test@test.com", password: "password") { 
              token
            }
          }`
        });

      const [error] = res.body.errors;
      expect(error.message.message).toEqual(AUTH_ERRORS.INCORRECT_EMAIL_ERR);
    });

    it('should not login if password is incorrect', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementationOnce(() =>
          Promise.resolve({ authenticate: () => false } as any)
        );

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation { 
            login(email: "test@test.com", password: "password") { 
              token
            }
          }`
        });

      const [error] = res.body.errors;
      expect(error.message.message).toEqual(AUTH_ERRORS.INCORRECT_PASSWORD_ERR);
    });
  });

  describe('signup()', () => {
    it('should signup successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            signup(user: {
              firstName: "test",
              lastName: "test",
              email: "test@test.com",
              password: "password"
            }) {
              token
            }
          }`
        })
        .expect({
          data: {
            signup: authPayload
          }
        });
    });

    it('should not signup if there are errors', async () => {
      jest
        .spyOn(usersService, 'create')
        .mockImplementationOnce(() => Promise.reject(validationError));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            signup(user: {
              firstName: "",
              lastName: "",
              email: "",
              password: ""
            }) {
              token
            }
          }`
        });

      const [errors] = res.body.errors;

      expect(errors).toEqual({
        lastName: { message: USER_VALIDATION_ERRORS.LAST_NAME_REQUIRED_ERR },
        firstName: { message: USER_VALIDATION_ERRORS.FIRST_NAME_REQUIRED_ERR },
        email: { message: USER_VALIDATION_ERRORS.EMAIL_REQUIRED_ERR }
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
