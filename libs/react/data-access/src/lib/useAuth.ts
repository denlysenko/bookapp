import { useLazyQuery, useMutation } from '@apollo/client';

import { storage, store } from '@bookapp/react/core';
import { AUTH_TOKEN } from '@bookapp/shared/constants';
import { AuthPayload, SignupCredentials, User } from '@bookapp/shared/interfaces';
import {
  GENERATE_AUTH_OPTIONS_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  SIGNUP_MUTATION,
  VERIFY_AUTHENTICATION_RESPONSE_MUTATION,
} from '@bookapp/shared/queries';

import {
  startAuthentication,
  type PublicKeyCredentialRequestOptionsJSON as RequestOptionsJSON,
} from '@simplewebauthn/browser';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [executeLoginMutation] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);
  const [executeGenerateAuthenticationOptionsMutation] = useMutation<{
    generateAuthenticationOptions: PublicKeyCredentialRequestOptionsJSON;
  }>(GENERATE_AUTH_OPTIONS_MUTATION);
  const [executeVerifyAuthenticationResponseMutation] = useMutation<{
    verifyAuthenticationResponse: AuthPayload;
  }>(VERIFY_AUTHENTICATION_RESPONSE_MUTATION);
  const [executeSignupMutation] = useMutation<{ signup: AuthPayload }>(SIGNUP_MUTATION);
  const [executeLogoutMutation, { client }] = useMutation<{ logout: boolean }>(LOGOUT_MUTATION);
  const [getMe, { data: currentUser, loading }] = useLazyQuery<{ me: User }>(ME_QUERY);

  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const { data, errors } = await executeLoginMutation({
      variables: {
        email,
        password,
      },
    });

    if (data) {
      const { accessToken, refreshToken } = data.login;
      storage.setItem(AUTH_TOKEN, refreshToken);
      store.set(AUTH_TOKEN, accessToken);

      return true;
    }

    if (errors) {
      return Promise.reject(errors);
    }
  };

  const loginWithPasskey = async () => {
    const result = await executeGenerateAuthenticationOptionsMutation();

    if (result.data) {
      try {
        const response = await startAuthentication({
          optionsJSON: result.data.generateAuthenticationOptions as RequestOptionsJSON,
        });

        const { data, errors } = await executeVerifyAuthenticationResponseMutation({
          variables: { response },
        });

        if (data) {
          const { accessToken, refreshToken } = data.verifyAuthenticationResponse;
          storage.setItem(AUTH_TOKEN, refreshToken);
          store.set(AUTH_TOKEN, accessToken);

          return true;
        }

        if (errors) {
          return Promise.reject(errors);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }

    if (result.errors) {
      return Promise.reject(result.errors);
    }
  };

  const signup = async (user: SignupCredentials) => {
    const { data, errors } = await executeSignupMutation({
      variables: {
        user,
      },
    });

    if (data) {
      const { accessToken, refreshToken } = data.signup;
      storage.setItem(AUTH_TOKEN, refreshToken);
      store.set(AUTH_TOKEN, accessToken);

      return true;
    }

    if (errors) {
      return Promise.reject(errors);
    }
  };

  const logout = async () => {
    const { data } = await executeLogoutMutation({
      variables: {
        refreshToken: storage.getItem(AUTH_TOKEN),
      },
    });

    if (data.logout) {
      await client.clearStore();

      storage.removeItem(AUTH_TOKEN);
      store.remove(AUTH_TOKEN);
      navigate('/auth');
    }
  };

  return {
    me: currentUser && currentUser.me,
    getMe,
    fetchingMe: loading,
    login,
    loginWithPasskey,
    signup,
    logout,
  };
}
