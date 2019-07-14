import { User } from '@bookapp/shared/models';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
