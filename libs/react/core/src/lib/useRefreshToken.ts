import { useEffect, useState } from 'react';
import { isNil } from 'lodash';

import { AUTH_TOKEN, HTTP_STATUS, REFRESH_TOKEN_HEADER } from '@bookapp/shared/constants';
import { AuthPayload } from '@bookapp/shared/interfaces';

import { storage } from './storage';
import { store } from './store';

export function useRefreshToken(refreshTokenUrl: string) {
  const refreshToken = storage.getItem(AUTH_TOKEN);
  const [loading, setLoading] = useState(() => !isNil(refreshToken));

  useEffect(() => {
    if (!isNil(refreshToken)) {
      fetch(refreshTokenUrl, {
        method: 'POST',
        headers: {
          [REFRESH_TOKEN_HEADER]: refreshToken,
        },
      })
        .then((res) => {
          if (res.status === HTTP_STATUS.UNAUTHORIZED) {
            storage.removeItem(AUTH_TOKEN);
            store.remove(AUTH_TOKEN);
          }

          if (!res.ok) {
            throw new Error(res.statusText);
          }

          return res.json();
        })
        .then((payload: AuthPayload) => {
          storage.setItem(AUTH_TOKEN, payload.refreshToken);
          store.set(AUTH_TOKEN, payload.accessToken);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, []);

  return {
    refreshing: loading,
  };
}
