/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthModule } from '@bookapp/api/auth';
import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { GraphqlModule } from '@bookapp/api/graphql';
import { ModelNames, MongooseValidationFilter } from '@bookapp/api/shared';
import { USER_VALIDATION_ERRORS, UsersModule, UsersService } from '@bookapp/api/users';
import { ROLES } from '@bookapp/shared/enums';
import {
  authPayload,
  MockAuthTokensService,
  MockConfigService,
  mockConnection,
  MockModel,
  MockUsersService,
  user,
} from '@bookapp/testing/api';

import { BadRequestException, INestApplication, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import jwt from 'jsonwebtoken';
import { ValidationError } from 'mongoose/lib/error';
import request from 'supertest';

const authToken = jwt.sign({ id: user.id }, 'ACCESS_TOKEN_SECRET');

const validationError = new ValidationError();
validationError.errors = {
  email: {
    message: USER_VALIDATION_ERRORS.EMAIL_REQUIRED_ERR,
  },
};

describe('UsersModule', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot('test'),
        UsersModule,
        AuthModule,
        GraphqlModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .overrideProvider(getModelToken(ModelNames.AUTH_TOKEN))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.PASSKEY))
      .useValue(MockModel)
      .overrideProvider(UsersService)
      .useValue(MockUsersService)
      .overrideProvider(AuthTokensService)
      .useValue(MockAuthTokensService)
      .compile();

    usersService = module.get<UsersService>(UsersService);

    jest.spyOn(usersService, 'findById').mockResolvedValue({
      ...user,
      roles: [ROLES.ADMIN],
    } as any);

    app = module.createNestApplication();
    app.useGlobalFilters(new MongooseValidationFilter());
    await app.init();
  });

  describe('getUsers()', () => {
    it('should get users', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            users {
              rows {
                id
              }
            }
          }`,
        })
        .expect({
          data: {
            users: {
              rows: [
                {
                  id: user.id,
                },
              ],
            },
          },
        });
    });

    it('should filter users', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            users(filter: { field: "test", search: "query" }) {
              rows {
                id
              }
            }
          }`,
        });

      expect(usersService.findAll).toHaveBeenCalledWith({
        filter: { test: /query/i },
        first: null,
        order: null,
        skip: null,
      });
    });

    it('should skip users', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            users(skip: 10) {
              rows {
                id
              }
            }
          }`,
        });

      expect(usersService.findAll).toHaveBeenCalledWith({
        filter: null,
        first: null,
        order: null,
        skip: 10,
      });
    });

    it('should limit users', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            users(first: 10) {
              rows {
                id
              }
            }
          }`,
        });

      expect(usersService.findAll).toHaveBeenCalledWith({
        filter: null,
        first: 10,
        order: null,
        skip: null,
      });
    });

    it('should order users', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            users(orderBy: email_asc) {
              rows {
                id
              }
            }
          }`,
        });

      expect(usersService.findAll).toHaveBeenCalledWith({
        filter: null,
        first: null,
        order: { email: 'asc' },
        skip: null,
      });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            users {
              rows {
                id
              }
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });

    it('should return FORBIDDEN error', async () => {
      jest
        .spyOn(usersService, 'findById')
        .mockImplementationOnce(() => Promise.resolve({ ...user } as any));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            users {
              rows {
                id
              }
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('FORBIDDEN');
    });
  });

  describe('getUser()', () => {
    it('should get user', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            user(id: "user_1") {
              email
            }
          }`,
        })
        .expect({
          data: {
            user: {
              email: user.email,
            },
          },
        });

      expect(usersService.findById).toHaveBeenCalledWith('user_1');
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            user(id: "user_1") {
              email
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });

    it('should return FORBIDDEN error', async () => {
      jest
        .spyOn(usersService, 'findById')
        .mockImplementationOnce(() => Promise.resolve({ ...user } as any));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            user(id: "user_1") {
              email
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('FORBIDDEN');
    });
  });

  describe('me()', () => {
    it('should get authenticated user', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            me {
              email
            }
          }`,
        })
        .expect({
          data: {
            me: {
              email: user.email,
            },
          },
        });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            me {
              email
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  describe('updateUser()', () => {
    it('should update user', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            updateUser(id: "user_1", user: { email: "test2@test.com" }) {
              email
            }
          }`,
        })
        .expect({
          data: {
            updateUser: {
              email: user.email,
            },
          },
        });

      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        email: 'test2@test.com',
      });
    });

    it('should not update user if there are errors', async () => {
      jest
        .spyOn(usersService, 'update')
        .mockImplementationOnce(() => Promise.reject(validationError));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            updateUser(id: "user_1", user: { email: "test2@test.com" }) {
              email
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.errors).toEqual({
        email: { message: USER_VALIDATION_ERRORS.EMAIL_REQUIRED_ERR },
      });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            updateUser(id: "user_1", user: { email: "test2@test.com" }) {
              email
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  describe('changePassword()', () => {
    it('should change password', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            changePassword(password: "newPassword", oldPassword: "oldPassword") {
              accessToken
              refreshToken
            }
          }`,
        })
        .expect({
          data: {
            changePassword: authPayload,
          },
        });

      expect(usersService.changePassword).toHaveBeenCalledWith(
        user.id,
        'oldPassword',
        'newPassword'
      );
    });

    it('should not change password if there are errors', async () => {
      jest
        .spyOn(usersService, 'changePassword')
        .mockImplementationOnce(() =>
          Promise.reject(new BadRequestException(USER_VALIDATION_ERRORS.OLD_PASSWORD_MATCH_ERR))
        );

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            changePassword(password: "newPassword", oldPassword: "oldPassword") {
              accessToken
              refreshToken
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.message).toEqual(USER_VALIDATION_ERRORS.OLD_PASSWORD_MATCH_ERR);
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            changePassword(password: "newPassword", oldPassword: "oldPassword") {
              accessToken
              refreshToken
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  describe('requestResetPassword()', () => {
    it('should return token', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            requestResetPassword(email: "test@test.com")
          }`,
        })
        .expect({
          data: {
            requestResetPassword: 'token',
          },
        });

      expect(usersService.requestResetPassword).toHaveBeenCalledWith('test@test.com');
    });

    it('should not return token if there are errors', async () => {
      jest
        .spyOn(usersService, 'requestResetPassword')
        .mockImplementation(() =>
          Promise.reject(new NotFoundException(USER_VALIDATION_ERRORS.EMAIL_NOT_FOUND_ERR))
        );

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            requestResetPassword(email: "test@test.com")
          }`,
        });

      const [error] = res.body.errors;
      expect(error.message).toEqual(USER_VALIDATION_ERRORS.EMAIL_NOT_FOUND_ERR);
    });
  });

  describe('resetPassword()', () => {
    it('should return true', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            resetPassword(token: "token", newPassword: "password")
          }`,
        })
        .expect({
          data: {
            resetPassword: true,
          },
        });

      expect(usersService.resetPassword).toHaveBeenCalledWith('token', 'password');
    });

    it('should return errors', async () => {
      jest
        .spyOn(usersService, 'resetPassword')
        .mockImplementation(() =>
          Promise.reject(new NotFoundException(USER_VALIDATION_ERRORS.TOKEN_NOT_FOUND_ERR))
        );

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            resetPassword(token: "token", newPassword: "password")
          }`,
        });

      const [error] = res.body.errors;
      expect(error.message).toEqual(USER_VALIDATION_ERRORS.TOKEN_NOT_FOUND_ERR);
    });
  });

  describe('deleteUser()', () => {
    it('should delete user', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            deleteUser(id: "user_1") {
              id
            }
          }`,
        })
        .expect({
          data: {
            deleteUser: {
              id: user.id,
            },
          },
        });

      expect(usersService.remove).toHaveBeenCalledWith('user_1');
    });

    it('should not delete user if there are errors', async () => {
      jest
        .spyOn(usersService, 'remove')
        .mockImplementationOnce(() =>
          Promise.reject(new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND_ERR))
        );

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            deleteUser(id: "user_1") {
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.message).toEqual(USER_VALIDATION_ERRORS.USER_NOT_FOUND_ERR);
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            deleteUser(id: "user_1") {
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });

    it('should return FORBIDDEN error', async () => {
      jest
        .spyOn(usersService, 'findById')
        .mockImplementationOnce(() => Promise.resolve({ ...user } as any));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            deleteUser(id: "user_1") {
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('FORBIDDEN');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
