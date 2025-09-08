import { TestBed } from '@angular/core/testing';

import { InMemoryCache } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';

import { ApiResponse, Passkey } from '@bookapp/shared/interfaces';
import {
  DELETE_PASSKEY_MUTATION,
  GENERATE_REGISTRATION_OPTIONS_MUTATION,
  GET_PASSKEYS_QUERY,
  UPDATE_PASSKEY_MUTATION,
  VERIFY_REGISTRATION_RESPONSE_MUTATION,
} from '@bookapp/shared/queries';
import { authenticationOptions, passkey, registrationResponse } from '@bookapp/testing/angular';

import {
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';

import { PasskeysService } from './passkeys.service';

const mockPasskeysResponse: ApiResponse<Passkey> = {
  count: 2,
  rows: [
    {
      ...passkey,
      id: '1',
      lastUsedAt: '',
      aaguid: '',
      backedUp: false,
      userId: '1',
      deviceType: 'desktop',
    } as unknown as Passkey,
    {
      ...passkey,
      id: '2',
      label: 'Second Passkey',
      lastUsedAt: 0,
      aaguid: '',
      backedUp: true,
      userId: '1',
      deviceType: 'desktop',
    } as unknown as Passkey,
  ],
};

describe('PasskeysService', () => {
  let controller: ApolloTestingController;
  let service: PasskeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [PasskeysService],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(PasskeysService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('watchPasskeys()', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ApolloTestingModule],
        providers: [
          PasskeysService,
          {
            provide: APOLLO_TESTING_CACHE,
            useValue: new InMemoryCache({ addTypename: true }),
          },
        ],
      });

      controller = TestBed.inject(ApolloTestingController);
      service = TestBed.inject(PasskeysService);
    });

    it('should return passkeys', (done) => {
      service.watchPasskeys().subscribe(({ data: { passkeys } }) => {
        expect(passkeys.count).toEqual(mockPasskeysResponse.count);
        expect(passkeys.rows).toHaveLength(2);
        expect(passkeys.rows[0].id).toEqual('1');
        done();
      });

      controller.expectOne(addTypenameToDocument(GET_PASSKEYS_QUERY)).flush({
        data: {
          passkeys: {
            ...mockPasskeysResponse,
            rows: mockPasskeysResponse.rows.map((row) => ({
              ...row,
              __typename: 'Passkey',
            })),
            __typename: 'PasskeysResponse',
          },
        },
      });

      controller.verify();
    });
  });

  describe('startRegistration()', () => {
    it('should start registration', (done) => {
      service.startRegistration().subscribe((options) => {
        expect(options).toEqual(authenticationOptions);
        done();
      });

      const op = controller.expectOne(GENERATE_REGISTRATION_OPTIONS_MUTATION);

      op.flush({
        data: {
          generateRegistrationOptions: authenticationOptions,
        },
      });

      controller.verify();
    });
  });

  describe('verifyRegistration()', () => {
    it('should verify registration', (done) => {
      service
        .verifyRegistration(registrationResponse)
        .subscribe(({ data: { verifyRegistration } }) => {
          expect(verifyRegistration).toEqual(passkey);
          done();
        });

      const op = controller.expectOne(VERIFY_REGISTRATION_RESPONSE_MUTATION);

      expect(op.operation.variables.response).toEqual(registrationResponse);

      op.flush({
        data: {
          verifyRegistration: passkey,
        },
      });

      controller.verify();
    });
  });

  describe('updatePasskey()', () => {
    const passkeyId = '1';
    const newLabel = 'Updated Label';

    it('should update passkey', (done) => {
      const updatedPasskey = { ...passkey, id: passkeyId, label: newLabel };

      service.updatePasskey(passkeyId, newLabel).subscribe(({ data: { editPasskey } }) => {
        expect(editPasskey).toEqual(updatedPasskey);
        done();
      });

      const op = controller.expectOne(UPDATE_PASSKEY_MUTATION);

      expect(op.operation.variables.id).toEqual(passkeyId);
      expect(op.operation.variables.label).toEqual(newLabel);

      op.flush({
        data: {
          editPasskey: updatedPasskey,
        },
      });

      controller.verify();
    });
  });

  describe('deletePasskey()', () => {
    const passkeyId = '1';

    it('should delete passkey', (done) => {
      service.deletePasskey(passkeyId).subscribe(({ data: { deletePasskey } }) => {
        expect(deletePasskey).toEqual(true);
        done();
      });

      const op = controller.expectOne(DELETE_PASSKEY_MUTATION);

      expect(op.operation.variables.id).toEqual(passkeyId);

      op.flush({
        data: {
          deletePasskey: true,
        },
      });

      controller.verify();
    });
  });
});
