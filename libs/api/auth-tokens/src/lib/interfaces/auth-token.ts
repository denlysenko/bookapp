import { Document } from 'mongoose';

interface AuthToken {
  userId: any;
  token: string;
}

export interface AuthTokenModel extends AuthToken, Document {}
