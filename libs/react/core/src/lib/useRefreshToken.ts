import { useEffect, useState } from 'react';

import { AUTH_TOKEN, HTTP_STATUS, REFRESH_TOKEN_HEADER } from '@bookapp/shared/constants';
import { environment } from '@bookapp/shared/environments';
import { AuthPayload } from '@bookapp/shared/interfaces';

import { storage } from './storage';
import { store } from './store';

export function useRefreshToken() {
  const refreshToken = storage.getItem(AUTH_TOKEN);
  const [loading, setLoading] = useState(() => !!refreshToken);

  useEffect(() => {
    if (refreshToken) {
      fetch(environment.refreshTokenUrl, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    refreshing: loading,
  };
}
