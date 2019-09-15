import { TestBed } from '@angular/core/testing';

import {
  AUTH_TOKEN,
  RouterExtensions,
  StoragePlatformService
} from '@bookapp/angular/core';
import { LOGIN_MUTATION, ME_QUERY, SIGNUP_MUTATION } from '@bookapp/shared';
import {
  authPayload,
  MockRouterExtensions,
  MockStoragePlatformService,
  user
} from '@bookapp/testing';

import {
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { addTypenameToDocument } from 'apollo-utilities';

import { AuthService } from './auth.service';

const email = 'test@test.com';
const pass = 'pass';

describe('AuthService', () => {
  let controller: ApolloTestingController;
  let service: AuthService;
  let storageService: StoragePlatformService;
  let router: RouterExtensions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        AuthService,
        {
          provide: StoragePlatformService,
          useValue: MockStoragePlatformService
        },
        {
          provide: RouterExtensions,
          useValue: MockRouterExtensions
        }
      ]
    });

    controller = TestBed.get(ApolloTestingController);
    service = TestBed.get(AuthService);
    storageService = TestBed.get(StoragePlatformService);
    router = TestBed.get(RouterExtensions);
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

  describe('me()', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ApolloTestingModule],
        providers: [
          AuthService,
          {
            provide: StoragePlatformService,
            useValue: MockStoragePlatformService
          },
          {
            provide: RouterExtensions,
            useValue: MockRouterExtensions
          },
          {
            provide: APOLLO_TESTING_CACHE,
            useValue: new InMemoryCache({ addTypename: true })
          }
        ]
      });

      controller = TestBed.get(ApolloTestingController);
      service = TestBed.get(AuthService);
    });

    it('should return logged user', done => {
      service.me().valueChanges.subscribe(({ data: { me } }) => {
        expect(me._id).toEqual(user._id);
        done();
      });

      controller.expectOne(addTypenameToDocument(ME_QUERY)).flush({
        data: {
          me: {
            ...user,
            __typename: 'User',
            reading: { ...user.reading, __typename: 'Reading' }
          }
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

    it('should navigate to auth', async () => {
      await service.logout();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
