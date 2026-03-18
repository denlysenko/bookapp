import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation } from '@apollo/client/react';

import { User } from '@bookapp/shared/interfaces';
import { UPDATE_USER_MUTATION } from '@bookapp/shared/queries';

export function useProfile() {
  const [executeUpdateMutation] = useMutation<{ updateUser: User }>(UPDATE_USER_MUTATION);

  const updateProfile = async (id: string, user: Partial<User>) => {
    const { data, error } = await executeUpdateMutation({
      variables: {
        id,
        user,
      },
    });

    if (data) {
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
    updateProfile,
  };
}
