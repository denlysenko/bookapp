import { User } from '@bookapp/shared/interfaces';
import { Document, Types } from 'mongoose';

export interface UserModel extends User, Document<Types.ObjectId> {
  password: string;
  salt: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  avatar?: string;
  authenticate(password: string): Promise<boolean>;
  makeSalt(byteSize?: number): Promise<string>;
  encryptPassword(password: string): Promise<string>;
}
