import { of } from 'rxjs';
import { user } from '../../test-data/user';

export const MockAngularAuthService = {
  fetchMe: jest.fn().mockReturnValue(of({ data: { me: user } })),
  watchMe: jest.fn().mockReturnValue(of({ data: { me: user } })),
  logout: jest.fn().mockReturnValue(of({ data: { logout: true } })),
};
