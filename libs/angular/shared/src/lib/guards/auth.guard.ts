import { inject } from '@angular/core';

import { RouterExtensions, StoragePlatformService, StoreService } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

import { of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';

export function authGuard() {
  const storeService = inject(StoreService);
  const storagePlatformService = inject(StoragePlatformService);
  const authService = inject(AuthService);
  const routerExtensions = inject(RouterExtensions);

  const waitForUser = () => {
    return authService.fetchMe().pipe(
      map(({ data }) => data.me),
      filter((user) => !!user),
      map(() => true),
      take(1)
    );
  };

  const accessToken = storeService.get(AUTH_TOKEN);
  const refreshToken = storagePlatformService.getItem(AUTH_TOKEN);

  if (accessToken) {
    return waitForUser();
  }

  if (!accessToken && refreshToken) {
    return authService.refreshTokens().pipe(
      switchMap(() => waitForUser()),
      catchError(() => of(false))
    );
  }

  routerExtensions.navigate(['auth'], {
    // for nativescript
    clearHistory: true,
    transition: {
      name: 'flip',
      duration: 300,
      curve: 'linear',
    },
  });

  return false;
}
