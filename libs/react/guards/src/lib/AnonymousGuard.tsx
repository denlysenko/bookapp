import { Navigate } from 'react-router-dom';

import { store } from '@bookapp/react/core';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

export const AnonymousGuard = ({ children }) => {
  const accessToken = store.get(AUTH_TOKEN);

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return children;
};
