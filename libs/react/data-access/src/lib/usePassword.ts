import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation } from '@apollo/client/react';

import { storage, store } from '@bookapp/react/core';
import { AUTH_TOKEN } from '@bookapp/shared/constants';
import { AuthPayload, PasswordForm } from '@bookapp/shared/interfaces';
import { CHANGE_PASSWORD_MUTATION } from '@bookapp/shared/queries';

export function usePassword() {
  const [executeMutation] = useMutation<{ changePassword: AuthPayload }>(CHANGE_PASSWORD_MUTATION);

  const changePassword = async ({ password, oldPassword }: PasswordForm) => {
    const { data, error } = await executeMutation({
      variables: {
        newPassword: password,
        oldPassword,
      },
    });

    if (data) {
      const { accessToken, refreshToken } = data.changePassword;

      storage.setItem(AUTH_TOKEN, refreshToken);
      store.set(AUTH_TOKEN, accessToken);

      return true;
    }

    if (error) {
      if (CombinedGraphQLErrors.is(error)) {
        return Promise.reject(error.errors);
      }

      return Promise.reject(error);
    }
  };

  return {
    changePassword,
  };
}
