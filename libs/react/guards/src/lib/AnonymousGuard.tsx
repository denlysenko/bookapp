import React, { ReactElement } from 'react';
import { RouteProps } from 'react-router';
import { Navigate, Route } from 'react-router-dom';

import { isNil } from 'lodash';

import { store } from '@bookapp/react/core';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

export const AnonymousGuard: React.FC<RouteProps> = (props): ReactElement | null => {
  const accessToken = store.get(AUTH_TOKEN);

  if (!isNil(accessToken)) {
    return <Navigate to="/" />;
  }

  return <Route {...props} />;
};
