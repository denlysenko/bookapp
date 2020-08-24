import { gql } from '@apollo/client';

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($newPassword: String!, $oldPassword: String!) {
    changePassword(password: $newPassword, oldPassword: $oldPassword) {
      accessToken
      refreshToken
    }
  }
`;
