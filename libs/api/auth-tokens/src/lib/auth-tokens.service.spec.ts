import { ConfigService } from '@bookapp/api/config';
import { AUTH_ERRORS, ModelNames } from '@bookapp/api/shared';
import {
  accessToken,
  authPayload,
  MockConfigService,
  MockModel,
  MockMongooseModel,
  refreshToken,
  user
} from '@bookapp/testing';

import { HttpStatus } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import * as jwt from 'jsonwebtoken';

import { AuthTokensService } from './auth-tokens.service';

describe('AuthTokensService', () => {
  let authTokensService: AuthTokensService;
  let tokenModel: any;
  let userModel: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthTokensService,
        {
          provide: ConfigService,
          useValue: MockConfigService
        },
        {
          provide: getModelToken(ModelNames.AUTH_TOKEN),
          useValue: MockModel
        },
        {
          provide: getConnectionToken(),
          useValue: {
            model: jest.fn(() => MockMongooseModel)
          }
        }
      ]
    }).compile();

    authTokensService = module.get<AuthTokensService>(AuthTokensService);
    tokenModel = module.get(getModelToken(ModelNames.AUTH_TOKEN));
    userModel = module.get(getConnectionToken()).model();

    jest
      .spyOn(tokenModel, 'exec')
      .mockImplementation(() => Promise.resolve(refreshToken));

    jest
      .spyOn(userModel, 'exec')
      .mockImplementation(() => Promise.resolve(user));

    jest.spyOn(jwt, 'verify').mockImplementation(() => ({
      id: user._id
    }));
  });

  describe('createAccessToken()', () => {
    beforeEach(() => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => accessToken);
    });

    it('should create access token', () => {
      expect(authTokensService.createAccessToken(user._id)).toEqual(
        accessToken
      );
    });
  });

  describe('createRefreshToken()', () => {
    beforeEach(() => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => refreshToken);
    });

    it('should create refresh token', async () => {
      expect(await authTokensService.createRefreshToken(user._id)).toEqual(
        refreshToken
      );
    });

    it('should save refresh token into DB', async () => {
      await authTokensService.createRefreshToken(user._id);
      expect(tokenModel.create).toHaveBeenCalledWith({
        token: refreshToken,
        userId: user._id
      });
    });
  });

  describe('refreshTokens()', () => {
    beforeEach(() => {
      jest
        .spyOn(authTokensService, 'createAccessToken')
        .mockImplementationOnce(() => accessToken);
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => refreshToken);
    });

    it('should return UNAUTHORIZED error if token is not passed', async () => {
      try {
        await authTokensService.refreshTokens(undefined);
      } catch (err) {
        expect(err.message).toEqual({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: AUTH_ERRORS.UNAUTHORIZED_ERR
        });
      }
    });

    it('should return UNAUTHORIZED error if token is not found in DB', async () => {
      jest
        .spyOn(tokenModel, 'exec')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await authTokensService.refreshTokens(refreshToken);
      } catch (err) {
        expect(err.message).toEqual({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: AUTH_ERRORS.UNAUTHORIZED_ERR
        });
      }
    });

    it('should return UNAUTHORIZED error if token is invalid', async () => {
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await authTokensService.refreshTokens(refreshToken);
      } catch (err) {
        expect(err.message).toEqual({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: AUTH_ERRORS.UNAUTHORIZED_ERR
        });
      }
    });

    it('should return UNAUTHORIZED error if user is not found', async () => {
      jest
        .spyOn(userModel, 'exec')
        .mockImplementation(() => Promise.resolve(null));

      try {
        await authTokensService.refreshTokens(refreshToken);
      } catch (err) {
        expect(err.message).toEqual({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: AUTH_ERRORS.UNAUTHORIZED_ERR
        });
      }
    });

    it('should remove old token from DB', async () => {
      await authTokensService.refreshTokens(refreshToken);
      expect(tokenModel.deleteOne).toHaveBeenCalledWith({
        token: refreshToken
      });
    });

    it('should return new pair of tokens', async () => {
      expect(await authTokensService.refreshTokens(refreshToken)).toEqual(
        authPayload
      );
    });
  });

  describe('revokeUserTokens()', () => {
    it('should remove all user tokens', async () => {
      await authTokensService.revokeUserTokens(user._id);
      expect(tokenModel.deleteMany).toHaveBeenCalledWith({ userId: user._id });
    });
  });

  describe('removeRefreshToken()', () => {
    it('should remove refresh tokens', async () => {
      await authTokensService.removeRefreshToken(refreshToken);
      expect(tokenModel.deleteOne).toHaveBeenCalledWith({
        token: refreshToken
      });
    });
  });
});
