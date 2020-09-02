import { TestBed } from '@angular/core/testing';

import { InMemoryCache } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';

import {
  AUTH_TOKEN,
  RouterExtensions,
  StoragePlatformService,
  StoreService,
} from '@bookapp/angular/core';
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  SIGNUP_MUTATION,
} from '@bookapp/shared/queries';
import {
  authPayload,
  MockRouterExtensions,
  MockStoragePlatformService,
  MockStoreService,
  user,
} from '@bookapp/testing';

import {
  ApolloTestingController,
  ApolloTestingModule,
  APOLLO_TESTING_CACHE,
} from 'apollo-angular/testing';

import { AuthService } from './auth.service';

const email = 'test@test.com';
const pass = 'pass';

// tslint:disable-next-line: no-big-function
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
        ],
      });

      controller = TestBed.inject(ApolloTestingController);
      service = TestBed.inject(AuthService);
    });

    it('should return logged user', (done) => {
      service.watchMe().subscribe(({ data: { me } }) => {
        expect(me._id).toEqual(user._id);
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
});
