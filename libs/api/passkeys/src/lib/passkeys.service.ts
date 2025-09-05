import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import type { ApiResponse, User } from '@bookapp/shared/interfaces';

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import {
  type AuthenticationResponseJSON,
  type AuthenticatorTransportFuture,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  type RegistrationResponseJSON,
  type VerifiedAuthenticationResponse,
  type VerifiedRegistrationResponse,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { Model } from 'mongoose';

import { PASSKEY_VALIDATION_ERRORS } from './constants';
import { PasskeyModel } from './interfaces/passkey';

@Injectable()
export class PasskeysService {
  private readonly logger = new Logger(PasskeysService.name);

  constructor(
    @InjectModel(ModelNames.PASSKEY) private readonly passkeyModel: Model<PasskeyModel>,
    private readonly configService: ConfigService
  ) {}

  async findAll(userId: string, query?: ApiQuery): Promise<ApiResponse<PasskeyModel>> {
    const { skip, first, order } = query;
    const [count, rows] = await Promise.all([
      this.passkeyModel.countDocuments({ userId }).exec(),
      this.passkeyModel
        .find({ userId })
        .skip(skip ?? 0)
        .limit(first ?? parseInt(this.configService.get('DEFAULT_LIMIT'), 10))
        .sort(order)
        .exec(),
    ]);

    return {
      count,
      rows,
    };
  }

  async update(userId: string, id: string, label: string): Promise<PasskeyModel> {
    const passkey = await this.passkeyModel.findOne({ _id: id, userId }).exec();

    if (!passkey) {
      this.logger.error(`Passkey: ${id} not found`);
      throw new NotFoundException(PASSKEY_VALIDATION_ERRORS.PASSKEY_NOT_FOUND_ERR);
    }

    Object.assign(passkey, { label });
    await passkey.save();
    this.logger.log(`Passkey: ${id} updated`);

    return passkey;
  }

  async delete(userId: string, id: string): Promise<PasskeyModel> {
    const passkey = await this.passkeyModel.findOne({ _id: id, userId }).exec();

    if (!passkey) {
      this.logger.error(`Passkey with id ${id} not found`);
      throw new NotFoundException(PASSKEY_VALIDATION_ERRORS.PASSKEY_NOT_FOUND_ERR);
    }

    await passkey.deleteOne().exec();
    this.logger.log(`Passkey: ${passkey.id} deleted`);

    return passkey;
  }

  async generateRegistrationOptions(user: User): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const rpName = this.configService.get<string>('PASSKEY_RP_NAME');
    const rpID = this.configService.get<string>('PASSKEY_RP_ID');
    const userPasskeys = await this.passkeyModel.find({ userId: user.id }).exec();

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: user.displayName ?? user.email,
      userDisplayName: user.displayName ?? user.email,
      attestationType: 'none',
      excludeCredentials: userPasskeys.map((credential) => ({
        id: credential.id,
        type: 'public-key',
        transports: credential.transports as AuthenticatorTransportFuture[],
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    return options;
  }

  async verifyRegistrationResponse(
    user: User,
    response: RegistrationResponseJSON,
    storedOptions: PublicKeyCredentialCreationOptionsJSON,
    expectedOrigin: string
  ): Promise<PasskeyModel> {
    let verification: VerifiedRegistrationResponse;

    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: storedOptions.challenge,
        expectedOrigin,
        expectedRPID: this.configService.get<string>('PASSKEY_RP_ID'),
        requireUserVerification: false,
      });
    } catch (error) {
      this.logger.error(`Passkey verification failed: ${error.message}`);
      throw new BadRequestException(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
    }

    const { verified, registrationInfo } = verification;

    if (!verified) {
      this.logger.error('Passkey was not verified');
      throw new BadRequestException(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
    }

    const count = await this.passkeyModel.countDocuments({ userId: user.id });
    const { credential, credentialDeviceType, credentialBackedUp, aaguid } = registrationInfo;

    const newPasskey = new this.passkeyModel({
      label: `Passkey #${count + 1}`,
      publicKey: Buffer.from(credential.publicKey),
      userId: user.id,
      credentialId: credential.id,
      webauthnUserID: storedOptions.user.id,
      counter: credential.counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      transports: credential.transports,
      aaguid,
    });

    await newPasskey.save();
    this.logger.log(`Passkey: ${newPasskey.id} created`);

    return newPasskey;
  }

  generateAuthenticationOptions(): Promise<PublicKeyCredentialRequestOptionsJSON> {
    return generateAuthenticationOptions({
      rpID: this.configService.get<string>('PASSKEY_RP_ID'),
    });
  }

  async verifyAuthenticationResponse(
    response: AuthenticationResponseJSON,
    expectedChallenge: string,
    expectedOrigin: string
  ): Promise<User> {
    const passkey = await this.passkeyModel
      .findOne({ credentialId: response.id })
      .populate('user')
      .exec();

    if (!passkey) {
      throw new NotFoundException(PASSKEY_VALIDATION_ERRORS.PASSKEY_NOT_FOUND_ERR);
    }

    let verification: VerifiedAuthenticationResponse;

    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge,
        expectedOrigin,
        expectedRPID: this.configService.get<string>('PASSKEY_RP_ID'),
        credential: {
          id: passkey.credentialId,
          publicKey: passkey.publicKey,
          counter: passkey.counter,
          transports: passkey.transports as AuthenticatorTransportFuture[],
        },
        requireUserVerification: false,
      });
    } catch (error) {
      this.logger.error(`Passkey verification failed: ${error.message}`);
      throw new BadRequestException(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
    }

    const { authenticationInfo, verified } = verification;

    if (!verified) {
      this.logger.error('Passkey was not verified');
      throw new BadRequestException(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
    }

    await this.passkeyModel
      .updateOne(
        { _id: passkey.id },
        {
          counter: authenticationInfo.newCounter,
          lastUsedAt: new Date(),
        }
      )
      .exec();

    return passkey.user;
  }
}
