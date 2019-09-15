import { User } from '@bookapp/shared';
import { Document } from 'mongoose';

export interface UserModel extends User, Document {
  password: string;
  salt: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  avatar?: string;
  authenticate: (password: string) => boolean;
  makeSalt: (
    byteSize: number,
    callback: (err: any, salt: string) => void
  ) => void;
  encryptPassword: (
    password: string,
    callback: (err: any, hashedPassword: string) => void
  ) => void;
}
