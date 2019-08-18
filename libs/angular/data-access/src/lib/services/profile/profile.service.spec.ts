import { TestBed } from '@angular/core/testing';

import { UPDATE_USER_MUTATION } from '@bookapp/shared/queries';
import { user } from '@bookapp/testing';

import {
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let controller: ApolloTestingController;
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [ProfileService]
    });

    controller = TestBed.get(ApolloTestingController);
    service = TestBed.get(ProfileService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('update()', () => {
    it('should update profile', () => {
      const updatedUser = { firstName: 'Updated' };

      service
        .update(user._id, updatedUser)
        .subscribe(({ data: { updateUser } }) => {
          expect(updateUser).toEqual(user);
        });

      const op = controller.expectOne(UPDATE_USER_MUTATION);

      expect(op.operation.variables.id).toEqual(user._id);
      expect(op.operation.variables.user).toEqual(updatedUser);

      op.flush({
        data: {
          updateUser: { ...user, __typename: 'User' }
        }
      });

      controller.verify();
    });
  });
});
