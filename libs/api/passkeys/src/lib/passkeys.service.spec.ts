import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import {
  authenticationOptions,
  authenticationResponse,
  MockConfigService,
  MockModel,
  MockMongooseModel,
  passkey,
  registrationResponse,
  user,
} from '@bookapp/testing/api';

import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

import { PASSKEY_VALIDATION_ERRORS } from './constants';
import { PasskeysService } from './passkeys.service';

jest.mock('@simplewebauthn/server', () => ({
  generateAuthenticationOptions: jest.fn(),
  generateRegistrationOptions: jest.fn(),
  verifyAuthenticationResponse: jest.fn(),
  verifyRegistrationResponse: jest.fn(),
}));

const mockStoredOptions = {
  challenge: 'challenge',
  rp: {
    name: 'BookApp',
    id: 'localhost',
  },
  user: {
    id: 'user-webauthn-id',
    name: 'test@test.com',
    displayName: 'test@test.com',
  },
  pubKeyCredParams: [
    {
      type: 'public-key' as const,
      alg: -7,
    },
  ],
  timeout: 60000,
  attestation: 'none' as const,
  excludeCredentials: [],
  authenticatorSelection: {
    residentKey: 'preferred' as const,
    userVerification: 'preferred' as const,
  },
};

describe('PasskeysService', () => {
  let passkeysService: PasskeysService;
  let configService: ConfigService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let passkeyModel: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PasskeysService,
        {
          provide: ConfigService,
          useValue: MockConfigService,
        },
        {
          provide: getModelToken(ModelNames.PASSKEY),
          useValue: MockModel,
        },
      ],
    }).compile();

    passkeysService = module.get<PasskeysService>(PasskeysService);
    configService = module.get<ConfigService>(ConfigService);
    passkeyModel = module.get(getModelToken(ModelNames.PASSKEY));

    jest.spyOn(passkeyModel, 'exec').mockImplementation(() => Promise.resolve(MockMongooseModel));
    jest.spyOn(passkeyModel, 'save').mockImplementation(() => Promise.resolve(passkey));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    beforeEach(() => {
      jest.spyOn(passkeyModel, 'exec').mockImplementation(() => Promise.resolve(1));
    });

    it('should count passkeys for user', async () => {
      await passkeysService.findAll('user-id', new ApiQuery());
      expect(passkeyModel.countDocuments).toHaveBeenCalledWith({ userId: 'user-id' });
    });

    it('should skip with default value', async () => {
      await passkeysService.findAll('user-id', new ApiQuery());
      expect(passkeyModel.skip).toHaveBeenCalledWith(0);
    });

    it('should skip with value from query', async () => {
      await passkeysService.findAll('user-id', new ApiQuery(null, null, 10));
      expect(passkeyModel.skip).toHaveBeenCalledWith(10);
    });

    it('should limit with default value', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('5');
      await passkeysService.findAll('user-id', new ApiQuery());
      expect(passkeyModel.limit).toHaveBeenCalledWith(5);
    });

    it('should limit with value from query', async () => {
      await passkeysService.findAll('user-id', new ApiQuery(null, 10, null));
      expect(passkeyModel.limit).toHaveBeenCalledWith(10);
    });

    it('should sort without value from query', async () => {
      await passkeysService.findAll('user-id', new ApiQuery());
      expect(passkeyModel.sort).toHaveBeenCalledWith(null);
    });

    it('should sort with value from query', async () => {
      const order = { createdAt: 'desc' } as const;
      await passkeysService.findAll('user-id', new ApiQuery(null, null, null, order));
      expect(passkeyModel.sort).toHaveBeenCalledWith(order);
    });

    it('should return api response with count and rows', async () => {
      jest
        .spyOn(passkeyModel, 'exec')
        .mockImplementationOnce(() => Promise.resolve(2))
        .mockImplementationOnce(() => Promise.resolve([passkey]));

      expect(await passkeysService.findAll('user-id', new ApiQuery())).toEqual({
        count: 2,
        rows: [passkey],
      });
    });
  });

  describe('update()', () => {
    it('should find passkey by id and userId', async () => {
      await passkeysService.update('user-id', 'passkey-id', 'New Label');
      expect(passkeyModel.findOne).toHaveBeenCalledWith({ _id: 'passkey-id', userId: 'user-id' });
    });

    it('should throw error if passkey is not found', async () => {
      jest.spyOn(passkeyModel, 'exec').mockImplementationOnce(() => Promise.resolve(null));

      try {
        await passkeysService.update('user-id', 'passkey-id', 'New Label');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(PASSKEY_VALIDATION_ERRORS.PASSKEY_NOT_FOUND_ERR);
      }
    });

    it('should update passkey label', async () => {
      await passkeysService.update('user-id', 'passkey-id', 'New Label');
      expect(passkeyModel.save).toHaveBeenCalled();
    });

    it('should reject passkey update', async () => {
      const error = { message: 'error' };
      jest.spyOn(passkeyModel, 'save').mockImplementationOnce(() => Promise.reject(error));

      expect(passkeysService.update('user-id', 'passkey-id', 'New Label')).rejects.toEqual(error);
    });
  });

  describe('delete()', () => {
    it('should find passkey by id and userId', async () => {
      await passkeysService.delete('user-id', 'passkey-id');
      expect(passkeyModel.findOne).toHaveBeenCalledWith({ _id: 'passkey-id', userId: 'user-id' });
    });

    it('should throw error if passkey is not found', async () => {
      jest.spyOn(passkeyModel, 'exec').mockImplementationOnce(() => Promise.resolve(null));

      try {
        await passkeysService.delete('user-id', 'passkey-id');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(PASSKEY_VALIDATION_ERRORS.PASSKEY_NOT_FOUND_ERR);
      }
    });

    it('should delete passkey', async () => {
      await passkeysService.delete('user-id', 'passkey-id');
      expect(passkeyModel.deleteOne).toHaveBeenCalled();
    });

    it('should reject passkey deletion', async () => {
      const error = { message: 'error' };
      jest
        .spyOn(passkeyModel.deleteOne(), 'exec')
        .mockImplementationOnce(() => Promise.reject(error));

      expect(passkeysService.delete('user-id', 'passkey-id')).rejects.toBe(error);
    });
  });

  describe('generateRegistrationOptions()', () => {
    beforeEach(() => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'PASSKEY_RP_NAME':
            return 'BookApp';
          case 'PASSKEY_RP_ID':
            return 'localhost';
          default:
            return key;
        }
      });

      jest.spyOn(passkeyModel, 'exec').mockImplementation(() => Promise.resolve([passkey]));
    });

    it('should find existing passkeys for user', async () => {
      await passkeysService.generateRegistrationOptions(user);
      expect(passkeyModel.find).toHaveBeenCalledWith({ userId: user.id });
    });

    it('should call generateRegistrationOptions with correct parameters', async () => {
      await passkeysService.generateRegistrationOptions(user);
      expect(generateRegistrationOptions).toHaveBeenCalledWith({
        rpName: 'BookApp',
        rpID: 'localhost',
        userName: user.displayName,
        userDisplayName: user.displayName,
        attestationType: 'none',
        excludeCredentials: [
          {
            id: passkey.id,
            type: 'public-key',
            transports: passkey.transports,
          },
        ],
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
      });
    });
  });

  describe('verifyRegistrationResponse()', () => {
    beforeEach(() => {
      jest.spyOn(configService, 'get').mockReturnValue('localhost');
      jest.spyOn(passkeyModel, 'countDocuments').mockResolvedValue(0);
      (verifyRegistrationResponse as jest.Mock).mockResolvedValue({
        verified: true,
        registrationInfo: {
          fmt: 'none' as const,
          aaguid: 'test-aaguid',
          credential: {
            id: 'credential-id',
            publicKey: new Uint8Array([1, 2, 3]),
            counter: 1,
            transports: ['usb', 'nfc'],
          },
          credentialType: 'public-key' as const,
          attestationObject: new Uint8Array([4, 5, 6]),
          userVerified: false,
          credentialDeviceType: 'singleDevice' as const,
          credentialBackedUp: false,
          origin: 'http://localhost:3000',
          rpID: 'localhost',
        },
      });
    });

    it('should verify registration response', async () => {
      await passkeysService.verifyRegistrationResponse(
        user,
        registrationResponse,
        mockStoredOptions,
        'http://localhost:3000'
      );

      expect(verifyRegistrationResponse).toHaveBeenCalledWith({
        response: registrationResponse,
        expectedChallenge: mockStoredOptions.challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        requireUserVerification: false,
      });
    });

    it('should throw error if verification fails', async () => {
      const error = new Error('Verification failed');
      (verifyRegistrationResponse as jest.Mock).mockRejectedValue(error);

      try {
        await passkeysService.verifyRegistrationResponse(
          user,
          registrationResponse,
          mockStoredOptions,
          'http://localhost:3000'
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
      }
    });

    it('should throw error if not verified', async () => {
      (verifyRegistrationResponse as jest.Mock).mockResolvedValue({
        verified: false,
        registrationInfo: null,
      });

      try {
        await passkeysService.verifyRegistrationResponse(
          user,
          registrationResponse,
          mockStoredOptions,
          'http://localhost:3000'
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
      }
    });

    it('should count existing passkeys', async () => {
      await passkeysService.verifyRegistrationResponse(
        user,
        registrationResponse,
        mockStoredOptions,
        'http://localhost:3000'
      );
      expect(passkeyModel.countDocuments).toHaveBeenCalledWith({ userId: user.id });
    });

    it('should create and save new passkey', async () => {
      await passkeysService.verifyRegistrationResponse(
        user,
        registrationResponse,
        mockStoredOptions,
        'http://localhost:3000'
      );

      expect(passkeyModel.save).toHaveBeenCalled();
    });

    it('should reject passkey creation', async () => {
      const error = { message: 'error' };
      jest.spyOn(passkeyModel, 'save').mockRejectedValue(error);

      expect(
        passkeysService.verifyRegistrationResponse(
          user,
          registrationResponse,
          mockStoredOptions,
          'http://localhost:3000'
        )
      ).rejects.toBe(error);
    });
  });

  describe('generateAuthenticationOptions()', () => {
    beforeEach(() => {
      jest.spyOn(configService, 'get').mockReturnValue('localhost');
      (generateAuthenticationOptions as jest.Mock).mockResolvedValue(authenticationOptions);
    });

    it('should call generateAuthenticationOptions with rpID', async () => {
      await passkeysService.generateAuthenticationOptions();
      expect(generateAuthenticationOptions).toHaveBeenCalledWith({
        rpID: 'localhost',
      });
    });

    it('should return authentication options', async () => {
      expect(await passkeysService.generateAuthenticationOptions()).toEqual(authenticationOptions);
    });
  });

  describe('verifyAuthenticationResponse()', () => {
    const mockPasskeyWithUser = {
      ...passkey,
      user: user,
    };

    beforeEach(() => {
      jest.spyOn(configService, 'get').mockReturnValue('localhost');
      jest.spyOn(passkeyModel, 'exec').mockResolvedValue(mockPasskeyWithUser);
      (verifyAuthenticationResponse as jest.Mock).mockResolvedValue({
        verified: true,
        authenticationInfo: {
          credentialID: 'credential-id',
          newCounter: 2,
          userVerified: false,
          credentialDeviceType: 'singleDevice' as const,
          credentialBackedUp: false,
          origin: 'http://localhost:3000',
          rpID: 'localhost',
        },
      });
    });

    it('should find passkey by credential id', async () => {
      await passkeysService.verifyAuthenticationResponse(
        authenticationResponse,
        'challenge',
        'http://localhost:3000'
      );

      expect(passkeyModel.findOne).toHaveBeenCalledWith({
        credentialId: authenticationResponse.id,
      });
      expect(passkeyModel.populate).toHaveBeenCalledWith('user');
    });

    it('should throw error if passkey not found', async () => {
      jest.spyOn(passkeyModel, 'exec').mockResolvedValue(null);

      try {
        await passkeysService.verifyAuthenticationResponse(
          authenticationResponse,
          'challenge',
          'http://localhost:3000'
        );
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(PASSKEY_VALIDATION_ERRORS.PASSKEY_NOT_FOUND_ERR);
      }
    });

    it('should verify authentication response', async () => {
      await passkeysService.verifyAuthenticationResponse(
        authenticationResponse,
        'challenge',
        'http://localhost:3000'
      );

      expect(verifyAuthenticationResponse).toHaveBeenCalledWith({
        response: authenticationResponse,
        expectedChallenge: 'challenge',
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        credential: {
          id: mockPasskeyWithUser.credentialId,
          publicKey: mockPasskeyWithUser.publicKey,
          counter: mockPasskeyWithUser.counter,
          transports: mockPasskeyWithUser.transports,
        },
        requireUserVerification: false,
      });
    });

    it('should throw error if verification fails', async () => {
      const error = new Error('Verification failed');
      (verifyAuthenticationResponse as jest.Mock).mockRejectedValue(error);

      try {
        await passkeysService.verifyAuthenticationResponse(
          authenticationResponse,
          'challenge',
          'http://localhost:3000'
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
      }
    });

    it('should throw error if not verified', async () => {
      (verifyAuthenticationResponse as jest.Mock).mockResolvedValue({
        verified: false,
        authenticationInfo: {
          credentialID: 'credential-id',
          newCounter: 2,
          userVerified: false,
          credentialDeviceType: 'singleDevice' as const,
          credentialBackedUp: false,
          origin: 'http://localhost:3000',
          rpID: 'localhost',
        },
      });

      try {
        await passkeysService.verifyAuthenticationResponse(
          authenticationResponse,
          'challenge',
          'http://localhost:3000'
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
      }
    });

    it('should update passkey counter and lastUsedAt', async () => {
      await passkeysService.verifyAuthenticationResponse(
        authenticationResponse,
        'challenge',
        'http://localhost:3000'
      );

      expect(passkeyModel.updateOne).toHaveBeenCalledWith(
        { _id: mockPasskeyWithUser.id },
        {
          counter: 2,
          lastUsedAt: expect.any(Date),
        }
      );
    });

    it('should return user', async () => {
      expect(
        await passkeysService.verifyAuthenticationResponse(
          authenticationResponse,
          'challenge',
          'http://localhost:3000'
        )
      ).toEqual(user);
    });
  });
});
