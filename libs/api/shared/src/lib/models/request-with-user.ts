import { User } from '@bookapp/shared/interfaces';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
