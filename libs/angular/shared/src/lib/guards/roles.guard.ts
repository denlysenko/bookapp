import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { RouterExtensions, StoragePlatformService, StoreService } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

import { of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';

export function rolesGuard(route: ActivatedRouteSnapshot) {
  const authService = inject(AuthService);
  const routerExtensions = inject(RouterExtensions);
  const storeService = inject(StoreService);
  const storagePlatformService = inject(StoragePlatformService);
  const roles = route.data['roles'];

  const waitForUserAndCheckAccess = (roles: string[]) => {
    return authService.fetchMe().pipe(
      map(({ data }) => data.me),
      filter((user) => !!user),
      map((user) => {
        if (!user.roles.some((role) => roles.includes(role))) {
          routerExtensions.navigate(['']);
          return false;
        }

        return true;
      }),
      take(1)
    );
  };

  const accessToken = storeService.get(AUTH_TOKEN);
  const refreshToken = storagePlatformService.getItem(AUTH_TOKEN);

  if (accessToken) {
    return waitForUserAndCheckAccess(roles);
  }

  if (!accessToken && refreshToken) {
    return authService.refreshTokens().pipe(
      switchMap(() => waitForUserAndCheckAccess(roles)),
      catchError(() => of(false))
    );
  }

  this.routerExtensions.navigate(['auth'], {
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
