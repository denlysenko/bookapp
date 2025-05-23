import type { Document, Types } from 'mongoose';

interface AuthToken {
  userId: Types.ObjectId;
  token: string;
}

export interface AuthTokenModel extends AuthToken, Document {}
