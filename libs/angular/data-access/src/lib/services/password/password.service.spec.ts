import { TestBed } from '@angular/core/testing';

import { CHANGE_PASSWORD_MUTATION } from '@bookapp/shared/queries';

import {
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';

import { PasswordService } from './password.service';

const oldPassword = 'old_pass';
const newPassword = 'new_pass';

describe('PasswordService', () => {
  let controller: ApolloTestingController;
  let service: PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [PasswordService]
    });

    controller = TestBed.get(ApolloTestingController);
    service = TestBed.get(PasswordService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('changePassword()', () => {
    it('should change password', () => {
      service
        .changePassword(newPassword, oldPassword)
        .subscribe(({ data: { changePassword } }) => {
          expect(changePassword).toEqual(true);
        });

      const op = controller.expectOne(CHANGE_PASSWORD_MUTATION);

      expect(op.operation.variables.newPassword).toEqual(newPassword);
      expect(op.operation.variables.oldPassword).toEqual(oldPassword);

      op.flush({
        data: {
          changePassword: true
        }
      });

      controller.verify();
    });
  });
});
