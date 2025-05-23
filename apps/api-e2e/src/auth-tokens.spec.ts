import { AuthTokensModule, AuthTokensService } from '@bookapp/api/auth-tokens';
import { AUTH_ERRORS, ModelNames } from '@bookapp/api/shared';
import {
  authPayload,
  MockAuthTokensService,
  MockConfigService,
  MockModel,
  refreshToken,
} from '@bookapp/testing/api';

import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import request from 'supertest';

describe('AuthTokenModule', () => {
  let app: INestApplication;
  let authTokensService: AuthTokensService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthTokensModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(getModelToken(ModelNames.AUTH_TOKEN))
      .useValue(MockModel)
      .overrideProvider(AuthTokensService)
      .useValue(MockAuthTokensService)
      .compile();

    authTokensService = module.get<AuthTokensService>(AuthTokensService);

    app = module.createNestApplication();
    await app.init();
  });

  describe('POST /refreshTokens', () => {
    it('should refresh tokens', async () => {
      jest
        .spyOn(authTokensService, 'refreshTokens')
        .mockImplementationOnce(() => Promise.resolve(authPayload));

      return request(app.getHttpServer())
        .post('/refreshTokens')
        .send({ refreshToken })
        .expect(HttpStatus.OK)
        .expect(authPayload);
    });

    it('should return error', async () => {
      const error = new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);

      jest
        .spyOn(authTokensService, 'refreshTokens')
        .mockImplementationOnce(() => Promise.reject(error));

      return request(app.getHttpServer())
        .post('/refreshTokens')
        .send({ refreshToken: undefined })
        .expect({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: AUTH_ERRORS.UNAUTHORIZED_ERR,
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
