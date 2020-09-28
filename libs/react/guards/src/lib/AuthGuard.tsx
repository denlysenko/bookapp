import React, { ReactElement, useEffect } from 'react';
import { RouteProps } from 'react-router';
import { Navigate, Route } from 'react-router-dom';

import { isNil } from 'lodash';

import { store } from '@bookapp/react/core';
import { useAuth } from '@bookapp/react/data-access';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

export const AuthGuard: React.FC<RouteProps> = (props): ReactElement | null => {
  const accessToken = store.get(AUTH_TOKEN);
  const { getMe, me, fetchingMe } = useAuth();

  useEffect(() => {
    console.log('auth guard effect');
    if (!isNil(accessToken) && isNil(me)) {
      getMe();
    }
  }, []);

  if (isNil(accessToken)) {
    return <Navigate to="/auth" />;
  }

  if (isNil(me)) {
    return null;
  }

  if (fetchingMe) {
    return null;
  }

  return <Route {...props} />;
};
