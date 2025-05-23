import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { FilesService } from '@bookapp/api/files';
import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import { ApiResponse, AuthPayload } from '@bookapp/shared/interfaces';
import { extractFileKey } from '@bookapp/utils/api';

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { randomBytes } from 'node:crypto';

import { USER_VALIDATION_ERRORS } from './constants';
import { UserDto } from './dto/user';
import { UserModel } from './interfaces/user';

export const EXCLUDED_FIELDS = '-salt -password';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(ModelNames.USER) private readonly userModel: Model<UserModel>,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
    private readonly authTokensService: AuthTokensService
  ) {}

  async findAll(query?: ApiQuery): Promise<ApiResponse<UserModel>> {
    const { filter, skip, first, order } = query;
    const where = filter ?? {};
    const [count, rows] = await Promise.all([
      this.userModel.countDocuments(where).exec(),
      this.userModel
        .find(where, EXCLUDED_FIELDS)
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

  findById(id: string): Promise<UserModel> {
    return this.userModel.findById(id, EXCLUDED_FIELDS).exec();
  }

  findByEmail(email: string): Promise<UserModel> {
    return this.userModel.findOne({ email }).exec();
  }

  create(user: UserDto): Promise<UserModel> {
    const newUser = new this.userModel(user);
    newUser.displayName = `${newUser.firstName} ${newUser.lastName}`;
    this.logger.log(`User: ${newUser.id} created`);

    return newUser.save();
  }

  async update(id: string, updatedUser: UserDto): Promise<UserModel> {
    const user = await this.userModel.findById(id, EXCLUDED_FIELDS).exec();

    if (!user) {
      this.logger.log(`User: ${id} not found`);
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND_ERR);
    }

    // remove old avatar from bucket first if new one is adding
    if (updatedUser.avatar && user.avatar && user.avatar !== updatedUser.avatar) {
      try {
        await this.filesService.deleteFromBucket(extractFileKey(user.avatar));
      } catch (err) {
        this.logger.error(`Failed to delete avatar from bucket for user ${id}`, err);
        throw new BadRequestException(err);
      }
    }

    Object.assign(user, updatedUser);
    user.displayName = `${user.firstName} ${user.lastName}`;
    await user.save();
    this.logger.log(`User: ${id} updated`);

    return user;
  }

  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<AuthPayload> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      this.logger.error(`User not found for id ${id}`);
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND_ERR);
    }

    if (!(await user.authenticate(oldPassword))) {
      this.logger.error(`Old password does not match for user ${id}`);
      throw new BadRequestException(USER_VALIDATION_ERRORS.OLD_PASSWORD_MATCH_ERR);
    }

    user.password = newPassword;

    await user.save();
    await this.authTokensService.revokeUserTokens(user.id);
    this.logger.log(`User: ${id} password changed`);

    return {
      accessToken: this.authTokensService.createAccessToken(user.id),
      refreshToken: await this.authTokensService.createRefreshToken(user.id),
    };
  }

  async requestResetPassword(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email }, EXCLUDED_FIELDS).exec();

    if (!user) {
      this.logger.error(`User with email ${email} not found`);
      throw new NotFoundException(USER_VALIDATION_ERRORS.EMAIL_NOT_FOUND_ERR);
    }

    const buffer = randomBytes(20);
    const token = buffer.toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires =
      Date.now() + parseInt(this.configService.get('REQUEST_TOKEN_EXPIRATION_TIME'), 10);

    await user.save();
    this.logger.log(`User: ${user.id} reset password token requested`);

    return token;
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    const user = await this.userModel
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      })
      .exec();

    if (!user) {
      this.logger.error(`User with token ${token} not found`);
      throw new NotFoundException(USER_VALIDATION_ERRORS.TOKEN_NOT_FOUND_ERR);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    this.logger.log(`User: ${user.id} reset password`);

    return true;
  }

  async remove(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id, EXCLUDED_FIELDS).exec();

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND_ERR);
    }

    if (user.avatar) {
      await this.filesService.deleteFromBucket(extractFileKey(user.avatar));
    }

    await user.deleteOne().exec();
    this.logger.log(`User: ${user.id} deleted`);

    return user;
  }
}
