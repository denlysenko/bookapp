import { Passkey, User } from '@bookapp/shared/interfaces';
import { Document, Types } from 'mongoose';

export interface PasskeyModel extends Omit<Passkey, 'id' | 'userId'>, Document<Types.ObjectId> {
  userId: Types.ObjectId;
  webauthnUserID: string;
  user?: User;
}
