/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthModule } from '@bookapp/api/auth';
import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { GraphqlModule } from '@bookapp/api/graphql';
import { PasskeysModule, PasskeysService } from '@bookapp/api/passkeys';
import { ModelNames } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import { ROLES } from '@bookapp/shared/enums';
import {
  authenticationOptions,
  MockAuthTokensService,
  MockConfigService,
  mockConnection,
  MockModel,
  MockPasskeysService,
  MockUsersService,
  passkey,
  registrationResponse,
  user,
} from '@bookapp/testing/api';

import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import jwt from 'jsonwebtoken';
import request from 'supertest';

const authToken = jwt.sign({ id: user.id }, 'ACCESS_TOKEN_SECRET');

describe('PasskeysModule', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let passkeysService: PasskeysService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot('test'),
        PasskeysModule,
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
      .overrideProvider(PasskeysService)
      .useValue(MockPasskeysService)
      .overrideProvider(AuthTokensService)
      .useValue(MockAuthTokensService)
      .compile();

    usersService = module.get<UsersService>(UsersService);
    passkeysService = module.get<PasskeysService>(PasskeysService);

    jest.spyOn(usersService, 'findById').mockResolvedValue({
      ...user,
      roles: [ROLES.USER],
    } as any);

    app = module.createNestApplication();
    app.use((req, res, next) => {
      req.session = {
        passkeyRegistrationOptions: authenticationOptions,
      };
      next();
    });
    await app.init();
  });

  describe('getPasskeys()', () => {
    it('should get passkeys', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            passkeys {
              rows {
                id
              }
            }
          }`,
        })
        .expect({
          data: {
            passkeys: {
              rows: [
                {
                  id: passkey.id,
                },
              ],
            },
          },
        });
    });

    it('should skip passkeys', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            passkeys(skip: 10) {
              rows {
                id
              }
            }
          }`,
        });

      expect(passkeysService.findAll).toHaveBeenCalledWith(user.id, {
        filter: null,
        first: null,
        order: null,
        skip: 10,
      });
    });

    it('should limit passkeys', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            passkeys(first: 10) {
              rows {
                id
              }
            }
          }`,
        });

      expect(passkeysService.findAll).toHaveBeenCalledWith(user.id, {
        filter: null,
        first: 10,
        order: null,
        skip: null,
      });
    });

    it('should order passkeys', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            passkeys(orderBy: createdAt_asc) {
              rows {
                id
              }
            }
          }`,
        });

      expect(passkeysService.findAll).toHaveBeenCalledWith(user.id, {
        filter: null,
        first: null,
        order: { createdAt: 'asc' },
        skip: null,
      });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            passkeys {
              rows {
                id
              }
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  describe('updatePasskey()', () => {
    it('should update passkey label', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            updatePasskey(id: "${passkey.id}", label: "New Label") {
              label
            }
          }`,
        })
        .expect({
          data: {
            updatePasskey: {
              label: passkey.label,
            },
          },
        });

      expect(passkeysService.update).toHaveBeenCalledWith(user.id, passkey.id, 'New Label');
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            updatePasskey(id: "${passkey.id}", label: "New Label") {
              label
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  describe('deletePasskey()', () => {
    it('should delete passkey', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            deletePasskey(id: "${passkey.id}")
          }`,
        })
        .expect({
          data: {
            deletePasskey: true,
          },
        });

      expect(passkeysService.delete).toHaveBeenCalledWith(user.id, passkey.id);
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            deletePasskey(id: "${passkey.id}")
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  describe('generateRegistrationOptions()', () => {
    it('should generate registration options', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            generateRegistrationOptions {
              challenge
            }
          }`,
        })
        .expect({
          data: {
            generateRegistrationOptions: {
              challenge: authenticationOptions.challenge,
            },
          },
        });

      expect(passkeysService.generateRegistrationOptions).toHaveBeenCalledWith(user);
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            generateRegistrationOptions {
              challenge
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  describe('verifyRegistrationResponse()', () => {
    it('should verify registration response and return passkey', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            verifyRegistrationResponse(response: {
              id: "${registrationResponse.id}",
              rawId: "${registrationResponse.rawId}",
              response: {
                attestationObject: "${registrationResponse.response.attestationObject}",
                clientDataJSON: "${registrationResponse.response.clientDataJSON}"
              },
              clientExtensionResults: {},
              authenticatorAttachment: "${registrationResponse.authenticatorAttachment}",
              type: "${registrationResponse.type}"
            }) {
              id
            }
          }`,
        })
        .expect({
          data: {
            verifyRegistrationResponse: {
              id: passkey.id,
            },
          },
        });

      expect(passkeysService.verifyRegistrationResponse).toHaveBeenCalledWith(
        user,
        registrationResponse,
        authenticationOptions,
        undefined
      );
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            verifyRegistrationResponse(response: {
              id: "${registrationResponse.id}",
              rawId: "${registrationResponse.rawId}",
              response: {
                attestationObject: "${registrationResponse.response.attestationObject}",
                clientDataJSON: "${registrationResponse.response.clientDataJSON}"
              },
              clientExtensionResults: {},
              authenticatorAttachment: "${registrationResponse.authenticatorAttachment}",
              type: "${registrationResponse.type}"
            }) {
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
