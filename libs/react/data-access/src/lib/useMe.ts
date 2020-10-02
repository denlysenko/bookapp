import { useQuery } from '@apollo/client';

import { User } from '@bookapp/shared/interfaces';
import { ME_QUERY } from '@bookapp/shared/queries';

export function useMe() {
  const { data, loading } = useQuery<{ me: User }>(ME_QUERY);

  return {
    me: data && data.me,
    loading,
  };
}
