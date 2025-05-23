import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { store } from '@bookapp/react/core';
import { useAuth } from '@bookapp/react/data-access';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

export const AuthGuard = ({ children }) => {
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

  if (!me) {
    return null;
  }

  if (fetchingMe) {
    return null;
  }

  return children;
};
