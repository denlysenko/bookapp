import { ConfigService } from '@bookapp/api/config';
import { FilesService } from '@bookapp/api/files';
import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import { ApiResponse } from '@bookapp/shared/models';

import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { randomBytes } from 'crypto';
import { extend } from 'lodash';
import { Model } from 'mongoose';

import { USER_VALIDATION_ERRORS } from './constants';
import { UserDto } from './dto/user';
import { UserModel } from './interfaces/user';

export const EXCLUDED_FIELDS = '-salt -password';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(ModelNames.USER) private readonly userModel: Model<UserModel>,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService
  ) {}

  async findAll(query?: ApiQuery): Promise<ApiResponse<UserModel>> {
    const { filter, skip, first, order } = query;
    const where = filter || {};
    const count = await this.userModel.countDocuments(where).exec();
    const rows = await this.userModel
      .find(where, EXCLUDED_FIELDS)
      .skip(skip || 0)
      .limit(first || parseInt(this.configService.get('DEFAULT_LIMIT'), 10))
      .sort(order)
      .exec();

    return {
      count,
      rows
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
    return newUser.save();
  }

  async update(id: string, updatedUser: UserDto): Promise<UserModel> {
    const user = await this.userModel.findById(id, EXCLUDED_FIELDS).exec();

    if (!user) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND_ERR);
    }

    // remove old avatar from bucket first if new one is adding
    if (
      updatedUser.avatar &&
      user.avatar &&
      user.avatar !== updatedUser.avatar
    ) {
      try {
        const splitted = user.avatar.split('/'); // take last part of uri as a key
        await this.filesService.deleteFromBucket(splitted[splitted.length - 1]);
      } catch (err) {
        throw new BadRequestException(err);
      }
    }

    extend(user, updatedUser);
    user.displayName = `${user.firstName} ${user.lastName}`;
    return user.save();
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND_ERR);
    }

    if (!user.authenticate(oldPassword)) {
      throw new BadRequestException(
        USER_VALIDATION_ERRORS.OLD_PASSWORD_MATCH_ERR
      );
    }

    user.password = newPassword;

    await user.save();
    return true;
  }

  async requestResetPassword(email: string): Promise<string> {
    let token;

    const user = await this.userModel
      .findOne({ email }, EXCLUDED_FIELDS)
      .exec();

    if (!user) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.EMAIL_NOT_FOUND_ERR);
    }

    const buffer = randomBytes(20);

    token = buffer.toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires =
      Date.now() +
      parseInt(this.configService.get('REQUEST_TOKEN_EXPIRATION_TIME'), 10);

    await user.save();

    return token;
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    const user = await this.userModel
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      })
      .exec();

    if (!user) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.TOKEN_NOT_FOUND_ERR);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return true;
  }

  async remove(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id, EXCLUDED_FIELDS).exec();

    if (!user) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND_ERR);
    }

    await user.remove();
    return user;
  }
}
