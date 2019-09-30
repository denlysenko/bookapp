import { of } from 'rxjs';
import { user } from '../../test-data/user';

export const MockAngularAuthService = {
  me: jest.fn().mockReturnValue({ valueChanges: of({ data: { me: user } }) }),
  logout: jest.fn().mockReturnValue(of({ data: { logout: true } }))
};
