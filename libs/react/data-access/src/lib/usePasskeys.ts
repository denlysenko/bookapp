import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation, useQuery } from '@apollo/client/react';

import { ApiResponse, Passkey } from '@bookapp/shared/interfaces';
import {
  DELETE_PASSKEY_MUTATION,
  GENERATE_REGISTRATION_OPTIONS_MUTATION,
  GET_PASSKEYS_QUERY,
  UPDATE_PASSKEY_MUTATION,
  VERIFY_REGISTRATION_RESPONSE_MUTATION,
} from '@bookapp/shared/queries';

import {
  browserSupportsWebAuthn,
  PublicKeyCredentialCreationOptionsJSON as CreationOptionsJSON,
  startRegistration,
} from '@simplewebauthn/browser';

export function usePasskeys() {
  const { data, loading, updateQuery } = useQuery<{ passkeys: ApiResponse<Passkey> }>(
    GET_PASSKEYS_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  );

  const [executeUpdatePasskeyMutation, { loading: updating }] = useMutation<{
    updatePasskey: Passkey;
  }>(UPDATE_PASSKEY_MUTATION);

  const [executeDeletePasskeyMutation, { loading: deleting }] = useMutation<{
    deletePasskey: boolean;
  }>(DELETE_PASSKEY_MUTATION);

  const [executeGenerateRegistrationOptionsMutation] = useMutation<{
    generateRegistrationOptions: PublicKeyCredentialCreationOptionsJSON;
  }>(GENERATE_REGISTRATION_OPTIONS_MUTATION);

  const [executeVerifyRegistrationResponseMutation] = useMutation<{
    verifyRegistrationResponse: Passkey;
  }>(VERIFY_REGISTRATION_RESPONSE_MUTATION);

  const updatePasskey = async (id: string, label: string) => {
    const { data, error } = await executeUpdatePasskeyMutation({
      variables: { id, label },
    });

    if (data) {
      updateQuery((_, { complete, previousData }) => {
        if (!complete) {
          return undefined;
        }

        return {
          passkeys: {
            count: previousData.passkeys.count,
            rows: previousData.passkeys.rows.map((passkey) =>
              passkey.id === id ? { ...data.updatePasskey, __typename: 'Passkey' } : passkey
            ),
            __typename: 'PasskeysResponse',
          },
        };
      });
    }

    if (error) {
      if (CombinedGraphQLErrors.is(error)) {
        return Promise.reject(error.errors);
      }

      return Promise.reject(error);
    }
  };

  const deletePasskey = async (id: string) => {
    const { data, error } = await executeDeletePasskeyMutation({
      variables: { id },
    });

    if (data) {
      updateQuery((_, { complete, previousData }) => {
        if (!complete) {
          return undefined;
        }

        return {
          passkeys: {
            count: previousData.passkeys.count - 1,
            rows: previousData.passkeys.rows.filter((passkey) => passkey.id !== id),
            __typename: 'PasskeysResponse',
          },
        };
      });
    }

    if (error) {
      if (CombinedGraphQLErrors.is(error)) {
        return Promise.reject(error.errors);
      }

      return Promise.reject(error);
    }
  };

  const addPasskey = async () => {
    const result = await executeGenerateRegistrationOptionsMutation();

    if (result.error) {
      if (CombinedGraphQLErrors.is(result.error)) {
        return Promise.reject(result.error.errors);
      }

      return Promise.reject(result.error);
    }

    if (result.data) {
      try {
        const optionsJSON = result.data.generateRegistrationOptions as CreationOptionsJSON;
        const response = await startRegistration({ optionsJSON });
        const { data, error } = await executeVerifyRegistrationResponseMutation({
          variables: { response },
        });

        if (data) {
          updateQuery((_, { complete, previousData }) => {
            if (!complete) {
              return undefined;
            }

            return {
              passkeys: {
                count: previousData.passkeys.count + 1,
                rows: [...previousData.passkeys.rows, data.verifyRegistrationResponse],
                __typename: 'PasskeysResponse',
              },
            };
          });
        }

        if (error) {
          if (CombinedGraphQLErrors.is(error)) {
            return Promise.reject(error.errors);
          }

          return Promise.reject(error);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };

  return {
    passkeys: data && data.passkeys,
    loading,
    updating,
    deleting,
    isSupported: browserSupportsWebAuthn(),
    updatePasskey,
    deletePasskey,
    addPasskey,
  };
}
