import { TestBed } from '@angular/core/testing';

import { AUTH_TOKEN, StoragePlatformService } from '@bookapp/angular/core';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '@bookapp/shared/queries';
import { authPayload, MockStoragePlatformService } from '@bookapp/testing';

import {
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';

import { AuthService } from './auth.service';

const email = 'test@test.com';
const pass = 'pass';

describe('AuthService', () => {
  let controller: ApolloTestingController;
  let service: AuthService;
  let storageService: StoragePlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        AuthService,
        {
          provide: StoragePlatformService,
          useValue: MockStoragePlatformService
        }
      ]
    });

    controller = TestBed.get(ApolloTestingController);
    service = TestBed.get(AuthService);
    storageService = TestBed.get(StoragePlatformService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should login', () => {
      service.login(email, pass).subscribe(({ data: { login: { token } } }) => {
        expect(token).toEqual(authPayload.token);
      });

      const op = controller.expectOne(LOGIN_MUTATION);

      expect(op.operation.variables.email).toEqual(email);
      expect(op.operation.variables.password).toEqual(pass);

      op.flush({
        data: {
          login: authPayload
        }
      });

      controller.verify();
    });

    it('should save token to storage', () => {
      service.login(email, pass).subscribe();

      const op = controller.expectOne(LOGIN_MUTATION);

      expect(storageService.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN,
        authPayload.token
      );

      op.flush({
        data: {
          login: authPayload
        }
      });

      controller.verify();
    });
  });

  describe('signup()', () => {
    const credentials = {
      email,
      password: pass,
      firstName: 'First Name',
      lastName: 'Last Name'
    };

    it('should signup', done => {
      service
        .signup(credentials)
        .subscribe(({ data: { signup: { token } } }) => {
          expect(token).toEqual(authPayload.token);
          done();
        });

      const op = controller.expectOne(SIGNUP_MUTATION);

      expect(op.operation.variables.user).toEqual(credentials);

      op.flush({
        data: {
          signup: authPayload
        }
      });

      controller.verify();
    });

    it('should save token to storage', () => {
      service.signup(credentials).subscribe();

      const op = controller.expectOne(SIGNUP_MUTATION);

      expect(storageService.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN,
        authPayload.token
      );

      op.flush({
        data: {
          signup: authPayload
        }
      });

      controller.verify();
    });
  });

  describe('logout()', () => {
    it('should remove token from storage', async () => {
      await service.logout();
      expect(storageService.removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
    });
  });
});
