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
import { ME_QUERY, UPDATE_USER_MUTATION } from '@bookapp/shared/queries';
import {
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

import { AuthService } from '../auth/auth.service';
import { ProfileService } from './profile.service';

const userWithTypename = { ...user, __typename: 'User' };

describe('ProfileService', () => {
  let controller: ApolloTestingController;
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [ProfileService],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(ProfileService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('update()', () => {
    it('should update profile', (done) => {
      const updatedUser = { firstName: 'Updated' };

      service.update(user.id, updatedUser).subscribe(({ data: { updateUser } }) => {
        expect(updateUser).toEqual(userWithTypename);
        done();
      });

      const op = controller.expectOne(UPDATE_USER_MUTATION);

      expect(op.operation.variables.id).toEqual(user.id);
      expect(op.operation.variables.user).toEqual(updatedUser);

      op.flush({
        data: {
          updateUser: userWithTypename,
        },
      });

      controller.verify();
    });
  });

  describe('saveReading()', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ApolloTestingModule],
        providers: [
          ProfileService,
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
      service = TestBed.inject(ProfileService);
    });

    it('should save reading', (done) => {
      const authService: AuthService = TestBed.inject(AuthService);
      const reading = { bookmark: 'bookmark', epubUrl: 'epubUrl' };

      authService.watchMe().subscribe();

      service.saveReading(user.id, reading).subscribe(({ data: { updateUser } }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { avatarUrl, createdAt, updatedAt, ...me } = userWithTypename;
        expect(updateUser).toEqual({
          ...me,
          reading: { ...userWithTypename.reading, __typename: 'Reading' },
        });
        done();
      });

      controller.expectOne(addTypenameToDocument(ME_QUERY)).flush({
        data: {
          me: {
            ...userWithTypename,
            reading: { ...userWithTypename.reading, __typename: 'Reading' },
          },
        },
      });

      const op = controller.expectOne(addTypenameToDocument(UPDATE_USER_MUTATION));

      expect(op.operation.variables.id).toEqual(user.id);
      expect(op.operation.variables.user).toEqual({ reading });

      op.flush({
        data: {
          updateUser: {
            ...userWithTypename,
            reading: { ...userWithTypename.reading, __typename: 'Reading' },
          },
        },
      });

      controller.verify();
    });
  });
});
