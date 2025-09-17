import { inject, Injectable } from '@angular/core';

import { ApiResponse, Passkey } from '@bookapp/shared/interfaces';
import {
  DELETE_PASSKEY_MUTATION,
  GENERATE_REGISTRATION_OPTIONS_MUTATION,
  GET_PASSKEYS_QUERY,
  UPDATE_PASSKEY_MUTATION,
  VERIFY_REGISTRATION_RESPONSE_MUTATION,
} from '@bookapp/shared/queries';

import { type RegistrationResponseJSON } from '@simplewebauthn/browser';
import { Apollo, QueryRef } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PasskeysService {
  readonly #apollo = inject(Apollo);

  #passkeysQueryRef: QueryRef<{ passkeys: ApiResponse<Passkey> }> | null = null;

  watchPasskeys() {
    if (!this.#passkeysQueryRef) {
      this.#passkeysQueryRef = this.#apollo.watchQuery<{ passkeys: ApiResponse<Passkey> }>({
        query: GET_PASSKEYS_QUERY,
        notifyOnNetworkStatusChange: true,
      });
    }

    return this.#passkeysQueryRef.valueChanges;
  }

  startRegistration() {
    return this.#apollo
      .mutate<{
        generateRegistrationOptions: PublicKeyCredentialCreationOptionsJSON;
      }>({
        mutation: GENERATE_REGISTRATION_OPTIONS_MUTATION,
      })
      .pipe(map(({ data }) => data.generateRegistrationOptions));
  }

  verifyRegistration(response: RegistrationResponseJSON) {
    return this.#apollo.mutate<{ verifyRegistration: Passkey }>({
      mutation: VERIFY_REGISTRATION_RESPONSE_MUTATION,
      variables: { response },
      update: (_, { data }) => {
        if (!this.#passkeysQueryRef || !data) {
          return;
        }

        this.#passkeysQueryRef.updateQuery((prevData) => {
          return {
            passkeys: {
              count: prevData.passkeys.count + 1,
              rows: [
                ...prevData.passkeys.rows,
                { ...data.verifyRegistration, __typename: 'Passkey' },
              ],
              __typename: 'PasskeysResponse',
            },
          };
        });
      },
    });
  }

  updatePasskey(id: string, label: string) {
    return this.#apollo.mutate<{ editPasskey: Passkey }>({
      mutation: UPDATE_PASSKEY_MUTATION,
      variables: { id, label },
      update: (_, { data }) => {
        if (!this.#passkeysQueryRef || !data) {
          return;
        }

        this.#passkeysQueryRef.updateQuery((prevData) => {
          return {
            passkeys: {
              count: prevData.passkeys.count,
              rows: prevData.passkeys.rows.map((passkey) =>
                passkey.id === id ? { ...data.editPasskey, __typename: 'Passkey' } : passkey
              ),
              __typename: 'PasskeysResponse',
            },
          };
        });
      },
    });
  }

  deletePasskey(id: string) {
    return this.#apollo.mutate<{ deletePasskey: boolean }>({
      mutation: DELETE_PASSKEY_MUTATION,
      variables: { id },
      update: (_, { data }) => {
        if (!this.#passkeysQueryRef || !data) {
          return;
        }

        this.#passkeysQueryRef.updateQuery((prevData) => {
          return {
            passkeys: {
              count: prevData.passkeys.count - 1,
              rows: prevData.passkeys.rows.filter((passkey) => passkey.id !== id),
              __typename: 'PasskeysResponse',
            },
          };
        });
      },
    });
  }
}
