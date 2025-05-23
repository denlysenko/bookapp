import { FC, ReactElement, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { store } from '@bookapp/react/core';
import { useAuth } from '@bookapp/react/data-access';
import { AUTH_TOKEN } from '@bookapp/shared/constants';
import { User } from '@bookapp/shared/interfaces';

interface Props {
  roles: string[];
  children: ReactElement;
}

const hasRights = (user: User | null, roles: string[]) =>
  !!user && user.roles.some((role) => roles.includes(role));

export const RolesGuard: FC<Props> = ({ roles, children }) => {
  const accessToken = store.get(AUTH_TOKEN);
  const { getMe, me, fetchingMe } = useAuth();

  useEffect(() => {
    if (accessToken && !me) {
      getMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!accessToken) {
    return <Navigate to="/auth" />;
  }

  if (me && !hasRights(me, roles)) {
    return <Navigate to="/" />;
  }

  if (me && hasRights(me, roles)) {
    return children;
  }

  if (fetchingMe) {
    return null;
  }

  return null;
};
