import { User } from '@bookapp/shared';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
