import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { InMemoryCache } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';

import {
  Environment,
  RouterExtensions,
  StoragePlatformService,
  StoreService,
} from '@bookapp/angular/core';
import { AUTH_TOKEN } from '@bookapp/shared/constants';
import {
  GENERATE_AUTH_OPTIONS_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  SIGNUP_MUTATION,
  VERIFY_AUTHENTICATION_RESPONSE_MUTATION,
} from '@bookapp/shared/queries';
import {
  authenticationOptions,
  authenticationResponse,
  authPayload,
  MockRouterExtensions,
  MockStoragePlatformService,
  MockStoreService,
  user,
} from '@bookapp/testing/angular';

import {
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';

import { AuthService } from './auth.service';

const email = 'test@test.com';
const pass = 'pass';

describe('AuthService', () => {
  let controller: ApolloTestingController;
  let service: AuthService;
  let storageService: StoragePlatformService;
  let router: RouterExtensions;
  let storeService: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        AuthService,
        {
          provide: StoragePlatformService,
          useValue: MockStoragePlatformService,
        },
        {
          provide: RouterExtensions,
          useValue: MockRouterExtensions,
        },
        {
          provide: StoreService,
          useValue: MockStoreService,
        },
        {
          provide: Environment,
          useValue: {},
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(AuthService);
    storageService = TestBed.inject(StoragePlatformService);
    router = TestBed.inject(RouterExtensions);
    storeService = TestBed.inject(StoreService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should login', () => {
      service.login(email, pass).subscribe(({ data: { login } }) => {
        expect(login).toEqual(authPayload);
      });

      const op = controller.expectOne(LOGIN_MUTATION);

      expect(op.operation.variables.email).toEqual(email);
      expect(op.operation.variables.password).toEqual(pass);

      op.flush({
        data: {
          login: authPayload,
        },
      });

      controller.verify();
    });

    it('should save tokens to storages', () => {
      service.login(email, pass).subscribe();

      const op = controller.expectOne(LOGIN_MUTATION);

      expect(storageService.setItem).toHaveBeenCalledWith(AUTH_TOKEN, authPayload.refreshToken);

      expect(storeService.set).toHaveBeenCalledWith(AUTH_TOKEN, authPayload.accessToken);

      op.flush({
        data: {
          login: authPayload,
        },
      });

      controller.verify();
    });
  });

  describe('signup()', () => {
    const credentials = {
      email,
      password: pass,
      firstName: 'First Name',
      lastName: 'Last Name',
    };

    it('should signup', (done) => {
      service.signup(credentials).subscribe(({ data: { signup } }) => {
        expect(signup).toEqual(authPayload);
        done();
      });

      const op = controller.expectOne(SIGNUP_MUTATION);

      expect(op.operation.variables.user).toEqual(credentials);

      op.flush({
        data: {
          signup: authPayload,
        },
      });

      controller.verify();
    });

    it('should save tokens to storages', () => {
      service.signup(credentials).subscribe();

      const op = controller.expectOne(SIGNUP_MUTATION);

      expect(storageService.setItem).toHaveBeenCalledWith(AUTH_TOKEN, authPayload.refreshToken);

      expect(storeService.set).toHaveBeenCalledWith(AUTH_TOKEN, authPayload.accessToken);

      op.flush({
        data: {
          signup: authPayload,
        },
      });

      controller.verify();
    });
  });

  describe('watchMe()', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ApolloTestingModule],
        providers: [
          AuthService,
          {
            provide: StoragePlatformService,
            useValue: MockStoragePlatformService,
          },
          {
            provide: RouterExtensions,
            useValue: MockRouterExtensions,
          },
          {
            provide: StoreService,
            useValue: MockStoreService,
          },
          {
            provide: APOLLO_TESTING_CACHE,
            useValue: new InMemoryCache({ addTypename: true }),
          },
          {
            provide: Environment,
            useValue: {},
          },
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      });

      controller = TestBed.inject(ApolloTestingController);
      service = TestBed.inject(AuthService);
    });

    it('should return logged user', (done) => {
      service.watchMe().subscribe(({ data: { me } }) => {
        expect(me.id).toEqual(user.id);
        done();
      });

      controller.expectOne(addTypenameToDocument(ME_QUERY)).flush({
        data: {
          me: {
            ...user,
            __typename: 'User',
            reading: { ...user.reading, __typename: 'Reading' },
          },
        },
      });

      controller.verify();
    });
  });

  describe('logout()', () => {
    it('should logout', (done) => {
      service.logout().subscribe(({ data: { logout } }) => {
        expect(logout).toEqual(true);
        done();
      });

      const op = controller.expectOne(LOGOUT_MUTATION);

      op.flush({
        data: {
          logout: true,
        },
      });

      controller.verify();
    });

    it('should remove tokens from storages', (done) => {
      service.logout().subscribe(() => {
        done();
      });

      const op = controller.expectOne(LOGOUT_MUTATION);

      op.flush({
        data: {
          logout: true,
        },
      });

      controller.verify();

      expect(storageService.removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
      expect(storeService.remove).toHaveBeenCalledWith(AUTH_TOKEN);
    });

    it('should navigate to auth', (done) => {
      service.logout().subscribe(() => {
        done();
      });

      const op = controller.expectOne(LOGOUT_MUTATION);

      op.flush({
        data: {
          logout: true,
        },
      });

      controller.verify();

      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('startPasskeyAuthentication()', () => {
    it('should startPasskeyAuthentication', () => {
      service.startPasskeyAuthentication().subscribe((generateAuthenticationOptions) => {
        expect(generateAuthenticationOptions).toEqual(authenticationOptions);
      });

      const op = controller.expectOne(GENERATE_AUTH_OPTIONS_MUTATION);

      op.flush({
        data: {
          generateAuthenticationOptions: authenticationOptions,
        },
      });

      controller.verify();
    });
  });

  describe('verifyPasskeyAuthentication()', () => {
    it('should verifyPasskeyAuthentication', (done) => {
      service
        .verifyPasskeyAuthentication(authenticationResponse)
        .subscribe(({ data: { verifyAuthenticationResponse } }) => {
          expect(verifyAuthenticationResponse).toEqual(authPayload);
          done();
        });

      const op = controller.expectOne(VERIFY_AUTHENTICATION_RESPONSE_MUTATION);

      expect(op.operation.variables.response).toEqual(authenticationResponse);

      op.flush({
        data: {
          verifyAuthenticationResponse: authPayload,
        },
      });

      controller.verify();
    });

    it('should save tokens to storages', () => {
      service.verifyPasskeyAuthentication(authenticationResponse).subscribe();

      const op = controller.expectOne(VERIFY_AUTHENTICATION_RESPONSE_MUTATION);

      expect(storageService.setItem).toHaveBeenCalledWith(AUTH_TOKEN, authPayload.refreshToken);

      expect(storeService.set).toHaveBeenCalledWith(AUTH_TOKEN, authPayload.accessToken);

      op.flush({
        data: {
          verifyAuthenticationResponse: authPayload,
        },
      });

      controller.verify();
    });
  });
});
