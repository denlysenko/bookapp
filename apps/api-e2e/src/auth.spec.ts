import { AuthModule } from '@bookapp/api/auth';
import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { GraphqlModule } from '@bookapp/api/graphql';
import { PasskeysService } from '@bookapp/api/passkeys';
import { AUTH_ERRORS, ModelNames, MongooseValidationFilter } from '@bookapp/api/shared';
import { USER_VALIDATION_ERRORS, UsersService } from '@bookapp/api/users';
import {
  authenticationOptions,
  authenticationResponse,
  authPayload,
  MockAuthTokensService,
  MockConfigService,
  mockConnection,
  MockModel,
  MockPasskeysService,
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
  let passkeysService: PasskeysService;

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
      .overrideProvider(getModelToken(ModelNames.PASSKEY))
      .useValue(MockModel)
      .overrideProvider(UsersService)
      .useValue(MockUsersService)
      .overrideProvider(PasskeysService)
      .useValue(MockPasskeysService)
      .overrideProvider(AuthTokensService)
      .useValue(MockAuthTokensService);

    const module = await moduleBuilder.compile();

    usersService = module.get<UsersService>(UsersService);
    passkeysService = module.get<PasskeysService>(PasskeysService);

    app = module.createNestApplication();
    app.useGlobalFilters(new MongooseValidationFilter());
    app.use((req, res, next) => {
      req.session = {
        passkeyAuthenticationOptions: authenticationOptions,
      };
      next();
    });
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

  describe('generateAuthenticationOptions()', () => {
    it('should generate authentication options', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            generateAuthenticationOptions {
              challenge
            }
          }`,
        })
        .expect({
          data: {
            generateAuthenticationOptions: {
              challenge: authenticationOptions.challenge,
            },
          },
        });

      expect(passkeysService.generateAuthenticationOptions).toHaveBeenCalled();
    });
  });

  describe('verifyAuthenticationResponse()', () => {
    it('should verify authentication response and return auth payload', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            verifyAuthenticationResponse(response: {
              id: "${authenticationResponse.id}",
              rawId: "${authenticationResponse.rawId}",
              response: {
                authenticatorData: "${authenticationResponse.response.authenticatorData}",
                clientDataJSON: "${authenticationResponse.response.clientDataJSON}",
                signature: "${authenticationResponse.response.signature}",
                userHandle: "${authenticationResponse.response.userHandle}",
              },
              clientExtensionResults: {},
              authenticatorAttachment: "${authenticationResponse.authenticatorAttachment}",
              type: "${authenticationResponse.type}"
            }) {
              accessToken
              refreshToken
            }
          }`,
        })
        .expect({
          data: {
            verifyAuthenticationResponse: authPayload,
          },
        });

      expect(passkeysService.verifyAuthenticationResponse).toHaveBeenCalledWith(
        authenticationResponse,
        authenticationOptions.challenge,
        undefined
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
