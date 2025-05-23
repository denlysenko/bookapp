import { ROLES } from '@bookapp/shared/enums';

import { Schema } from 'mongoose';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import { USER_VALIDATION_ERRORS } from '../constants';
import { UserModel } from '../interfaces/user';

const scryptAsync = promisify(scrypt);
const randomBytesAsync = promisify(randomBytes);

const validatePassword = function (password: string): boolean {
  return password && password.length > 6;
};

const defaultByteSize = 32;

export const UserSchema = new Schema<UserModel>(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, USER_VALIDATION_ERRORS.FIRST_NAME_REQUIRED_ERR],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, USER_VALIDATION_ERRORS.LAST_NAME_REQUIRED_ERR],
    },
    displayName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, USER_VALIDATION_ERRORS.EMAIL_REQUIRED_ERR],
      unique: [true, USER_VALIDATION_ERRORS.EMAIL_IN_USE_ERR],
      validate: {
        validator: (value: string) => {
          return /.+@.+\..+/.test(value);
        },
        message: () => USER_VALIDATION_ERRORS.EMAIL_INVALID_ERR,
      },
    },
    password: {
      type: String,
      default: '',
      validate: [validatePassword, USER_VALIDATION_ERRORS.PASSWORD_LENGTH_ERR],
    },
    salt: String,
    avatar: String,
    roles: {
      type: [{ type: String, enum: [ROLES.ADMIN, ROLES.USER] }],
      default: [ROLES.USER],
    },
    reading: {
      epubUrl: {
        type: String,
        default: '',
      },
      bookmark: {
        type: String,
        default: '',
      },
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

UserSchema.pre<UserModel>('save', async function () {
  if (this.isModified('password')) {
    this.salt = await this.makeSalt();
    this.password = await this.encryptPassword(this.password);
  }
});

UserSchema.methods.authenticate = async function (password: string): Promise<boolean> {
  const hashedPassword = await this.encryptPassword(password);
  return timingSafeEqual(
    Buffer.from(this.password, 'base64'),
    Buffer.from(hashedPassword, 'base64')
  );
};

UserSchema.methods.makeSalt = async function (byteSize = defaultByteSize): Promise<string> {
  const salt = await randomBytesAsync(byteSize);
  return salt.toString('base64');
};

UserSchema.methods.encryptPassword = async function (password: string): Promise<string> {
  if (!password || !this.salt) {
    throw new Error(USER_VALIDATION_ERRORS.MISSING_PASSWORD_OR_SALT);
  }

  const keyLength = 64;
  const salt = Buffer.from(this.salt, 'base64');
  const key = (await scryptAsync(password, salt, keyLength)) as Buffer;

  return key.toString('base64');
};
