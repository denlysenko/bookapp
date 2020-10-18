import { gql } from '@apollo/client/core';

import { ProfileFragment } from './fragments';

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup($user: UserInput!) {
    signup(user: $user) {
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken)
  }
`;

export const ME_QUERY = gql`
  query me {
    me {
      ...Profile
    }
  }
  ${ProfileFragment}
`;
