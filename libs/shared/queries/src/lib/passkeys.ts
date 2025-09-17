import { gql } from '@apollo/client/core';

export const GET_PASSKEYS_QUERY = gql`
  query getPasskeys {
    passkeys {
      count
      rows {
        id
        label
        deviceType
        backedUp
        aaguid
        lastUsedAt
      }
    }
  }
`;

export const GENERATE_REGISTRATION_OPTIONS_MUTATION = gql`
  mutation generateRegistrationOptions {
    generateRegistrationOptions {
      attestation
      authenticatorSelection {
        authenticatorAttachment
        requireResidentKey
        residentKey
        userVerification
      }
      challenge
      excludeCredentials {
        id
        transports
        type
      }
      extensions {
        credProps
        hmacCreateSecret
      }
      hints
      pubKeyCredParams {
        alg
        type
      }
      rp {
        id
        name
      }
      timeout
      user {
        displayName
        id
        name
      }
    }
  }
`;

export const VERIFY_REGISTRATION_RESPONSE_MUTATION = gql`
  mutation verifyRegistrationResponse($response: RegistrationResponseInput!) {
    verifyRegistrationResponse(response: $response) {
      id
      label
      deviceType
      backedUp
      aaguid
      lastUsedAt
    }
  }
`;

export const UPDATE_PASSKEY_MUTATION = gql`
  mutation updatePasskey($id: ID!, $label: String!) {
    updatePasskey(id: $id, label: $label) {
      id
      label
      deviceType
      backedUp
      aaguid
      lastUsedAt
    }
  }
`;

export const DELETE_PASSKEY_MUTATION = gql`
  mutation deletePasskey($id: ID!) {
    deletePasskey(id: $id)
  }
`;
