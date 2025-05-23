import { User } from './user';

export interface ProfileForm {
  id: string;
  user: Partial<User>;
}
