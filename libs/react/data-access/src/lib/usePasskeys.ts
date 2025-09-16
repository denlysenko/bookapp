import { ApiResponse, Passkey } from '@bookapp/shared/interfaces';
import {
  DELETE_PASSKEY_MUTATION,
  GENERATE_REGISTRATION_OPTIONS_MUTATION,
  GET_PASSKEYS_QUERY,
  UPDATE_PASSKEY_MUTATION,
  VERIFY_REGISTRATION_RESPONSE_MUTATION,
} from '@bookapp/shared/queries';

import { useMutation, useQuery } from '@apollo/client';
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
      notifyOnNetworkStatusChange: true,
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
    try {
      const { data, errors } = await executeUpdatePasskeyMutation({
        variables: { id, label },
      });

      if (errors) {
        return Promise.reject(errors);
      }

      if (data) {
        updateQuery((prevData) => {
          return {
            passkeys: {
              count: prevData.passkeys.count,
              rows: prevData.passkeys.rows.map((passkey) =>
                passkey.id === id ? { ...data.updatePasskey, __typename: 'Passkey' } : passkey
              ),
              __typename: 'PasskeysResponse',
            },
          };
        });
      }
    } catch (err) {
      Promise.reject(err);
    }
  };

  const deletePasskey = async (id: string) => {
    try {
      const { data, errors } = await executeDeletePasskeyMutation({
        variables: { id },
      });

      if (errors) {
        return Promise.reject(errors);
      }

      if (data) {
        updateQuery((prevData) => {
          return {
            passkeys: {
              count: prevData.passkeys.count,
              rows: prevData.passkeys.rows.filter((passkey) => passkey.id !== id),
              __typename: 'PasskeysResponse',
            },
          };
        });
      }
    } catch (err) {
      Promise.reject(err);
    }
  };

  const addPasskey = async () => {
    try {
      const result = await executeGenerateRegistrationOptionsMutation();

      if (result.errors) {
        return Promise.reject(result.errors);
      }

      if (result.data) {
        const optionsJSON = result.data.generateRegistrationOptions as CreationOptionsJSON;
        const response = await startRegistration({ optionsJSON });
        const { data, errors } = await executeVerifyRegistrationResponseMutation({
          variables: { response },
        });

        if (errors) {
          return Promise.reject(errors);
        }

        if (data) {
          updateQuery((prevData) => {
            return {
              passkeys: {
                count: prevData.passkeys.count + 1,
                rows: [...prevData.passkeys.rows, data.verifyRegistrationResponse],
                __typename: 'PasskeysResponse',
              },
            };
          });
        }
      }
    } catch {
      return Promise.reject([new Error('Error adding passkey')]);
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
