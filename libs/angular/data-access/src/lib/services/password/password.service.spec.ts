import { TestBed } from '@angular/core/testing';

import { AUTH_TOKEN, StoragePlatformService, StoreService } from '@bookapp/angular/core';
import { CHANGE_PASSWORD_MUTATION } from '@bookapp/shared/queries';
import { authPayload, MockStoragePlatformService, MockStoreService } from '@bookapp/testing';

import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { PasswordService } from './password.service';

const oldPassword = 'old_pass';
const newPassword = 'new_pass';

describe('PasswordService', () => {
  let controller: ApolloTestingController;
  let service: PasswordService;
  let storageService: StoragePlatformService;
  let storeService: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        PasswordService,
        {
          provide: StoragePlatformService,
          useValue: MockStoragePlatformService,
        },
        {
          provide: StoreService,
          useValue: MockStoreService,
        },
      ],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(PasswordService);
    storageService = TestBed.inject(StoragePlatformService);
    storeService = TestBed.inject(StoreService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('changePassword()', () => {
    it('should change password', (done) => {
      service.changePassword(newPassword, oldPassword).subscribe(({ data: { changePassword } }) => {
        expect(changePassword).toEqual(authPayload);
        done();
      });

      const op = controller.expectOne(CHANGE_PASSWORD_MUTATION);

      expect(op.operation.variables.newPassword).toEqual(newPassword);
      expect(op.operation.variables.oldPassword).toEqual(oldPassword);

      op.flush({
        data: {
          changePassword: authPayload,
        },
      });

      controller.verify();
    });

    it('should save tokens to storages', () => {
      service.changePassword(newPassword, oldPassword).subscribe();

      const op = controller.expectOne(CHANGE_PASSWORD_MUTATION);

      op.flush({
        data: {
          changePassword: authPayload,
        },
      });

      expect(storageService.setItem).toHaveBeenCalledWith(AUTH_TOKEN, authPayload.refreshToken);
      expect(storeService.set).toHaveBeenCalledWith(AUTH_TOKEN, authPayload.accessToken);

      controller.verify();
    });
  });
});
