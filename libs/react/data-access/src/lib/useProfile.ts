import { useMutation } from '@apollo/client';

import { User } from '@bookapp/shared/interfaces';
import { UPDATE_USER_MUTATION } from '@bookapp/shared/queries';

export function useProfile() {
  const [executeUpdateMutation] = useMutation<{ updateUser: User }>(UPDATE_USER_MUTATION);

  const updateProfile = async (id: string, user: Partial<User>) => {
    const { data, errors } = await executeUpdateMutation({
      variables: {
        id,
        user,
      },
    });

    if (data) {
      return true;
    }

    if (errors) {
      return Promise.reject(errors);
    }
  };

  return {
    updateProfile,
  };
}
