import React, { ReactElement, useEffect } from 'react';
import { RouteProps } from 'react-router';
import { Navigate, Route } from 'react-router-dom';

import { isNil } from 'lodash';

import { store } from '@bookapp/react/core';
import { useAuth } from '@bookapp/react/data-access';
import { AUTH_TOKEN } from '@bookapp/shared/constants';
import { User } from '@bookapp/shared/interfaces';

interface Props extends RouteProps {
  roles: string[];
}

const hasRights = (user: User | null, roles: string[]) =>
  !isNil(user) && user.roles.some((role) => roles.includes(role));

export const RolesGuard: React.FC<Props> = ({ roles, ...props }): ReactElement | null => {
  const accessToken = store.get(AUTH_TOKEN);
  const { getMe, me, fetchingMe } = useAuth();

  useEffect(() => {
    console.log('roles guard effect');
    if (!isNil(accessToken) && isNil(me)) {
      getMe();
    }
  }, []);

  if (isNil(accessToken)) {
    return <Navigate to="/auth" />;
  }

  if (!isNil(me) && !hasRights(me, roles)) {
    return <Navigate to="/" />;
  }

  if (!isNil(me) && hasRights(me, roles)) {
    return <Route {...props} />;
  }

  if (fetchingMe) {
    return null;
  }

  return null;
};
