import { useMutation } from '@apollo/client';

import { storage, store } from '@bookapp/react/core';
import { AUTH_TOKEN } from '@bookapp/shared/constants';
import { AuthPayload, PasswordForm } from '@bookapp/shared/interfaces';
import { CHANGE_PASSWORD_MUTATION } from '@bookapp/shared/queries';

export function usePassword() {
  const [executeMutation] = useMutation<{ changePassword: AuthPayload }>(CHANGE_PASSWORD_MUTATION);

  const changePassword = async ({ password, oldPassword }: PasswordForm) => {
    try {
      const { data, errors } = await executeMutation({
        variables: {
          newPassword: password,
          oldPassword,
        },
      });

      if (errors) {
        return Promise.reject(errors);
      }

      const { accessToken, refreshToken } = data.changePassword;

      storage.setItem(AUTH_TOKEN, refreshToken);
      store.set(AUTH_TOKEN, accessToken);

      return true;
    } catch (err) {
      Promise.reject(err);
    }
  };

  return {
    changePassword,
  };
}
