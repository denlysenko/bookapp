import { AuthModule } from '@bookapp/api/auth';
import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { GraphqlModule } from '@bookapp/api/graphql';
import { AUTH_ERRORS, ModelNames, MongooseValidationFilter } from '@bookapp/api/shared';
import { USER_VALIDATION_ERRORS, UsersService } from '@bookapp/api/users';
import {
  authPayload,
  MockAuthTokensService,
  MockConfigService,
  mockConnection,
  MockModel,
  MockUsersService,
} from '@bookapp/testing/api';

import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { ValidationError } from 'mongoose/lib/error';
import request from 'supertest';

const validationError = new ValidationError();
validationError.errors = {
  lastName: {
    message: USER_VALIDATION_ERRORS.LAST_NAME_REQUIRED_ERR,
  },
  firstName: {
    message: USER_VALIDATION_ERRORS.FIRST_NAME_REQUIRED_ERR,
  },
  email: {
    message: USER_VALIDATION_ERRORS.EMAIL_REQUIRED_ERR,
  },
};

describe('AuthModule', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot('test'),
        AuthModule,
        GraphqlModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.AUTH_TOKEN))
      .useValue(MockModel)
      .overrideProvider(UsersService)
      .useValue(MockUsersService)
      .overrideProvider(AuthTokensService)
      .useValue(MockAuthTokensService);

    const module = await moduleBuilder.compile();

    usersService = module.get<UsersService>(UsersService);

    app = module.createNestApplication();
    app.useGlobalFilters(new MongooseValidationFilter());
    await app.init();
  });

  describe('login()', () => {
    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            login(email: "test@test.com", password: "password") {
              accessToken
              refreshToken
            }
          }`,
        })
        .expect({
          data: {
            login: authPayload,
          },
        });
    });

    it('should not login if email is not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockImplementationOnce(() => Promise.resolve(null));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            login(email: "test@test.com", password: "password") {
              accessToken
              refreshToken
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.message).toEqual(AUTH_ERRORS.INCORRECT_EMAIL_OR_PASSWORD_ERR);
    });

    it('should not login if password is incorrect', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce(() => Promise.resolve({ authenticate: () => false } as any));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            login(email: "test@test.com", password: "password") {
              accessToken
              refreshToken
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.message).toEqual(AUTH_ERRORS.INCORRECT_EMAIL_OR_PASSWORD_ERR);
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
              accessToken
              refreshToken
            }
          }`,
        })
        .expect({
          data: {
            signup: authPayload,
          },
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
              accessToken
              refreshToken
            }
          }`,
        });

      const [errors] = res.body.errors;

      expect(errors.extensions.errors).toEqual({
        lastName: { message: USER_VALIDATION_ERRORS.LAST_NAME_REQUIRED_ERR },
        firstName: { message: USER_VALIDATION_ERRORS.FIRST_NAME_REQUIRED_ERR },
        email: { message: USER_VALIDATION_ERRORS.EMAIL_REQUIRED_ERR },
      });
    });
  });

  describe('logout()', () => {
    it('should logout', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            logout(refreshToken: "refreshToken")
          }`,
        })
        .expect({
          data: {
            logout: true,
          },
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
