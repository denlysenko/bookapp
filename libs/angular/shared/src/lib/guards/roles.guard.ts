import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route } from '@angular/router';

import {
  Environment,
  RouterExtensions,
  StoragePlatformService,
  StoreService,
} from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

import { isNil } from 'lodash';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMapTo, take } from 'rxjs/operators';

@Injectable()
export class RolesGuard implements CanActivate, CanLoad {
  constructor(
    private readonly authService: AuthService,
    private readonly routerExtensions: RouterExtensions,
    private readonly storeService: StoreService,
    private readonly storagePlatformService: StoragePlatformService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.hasRoles(route.data['roles']);
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    return this.hasRoles(route.data['roles']);
  }

  private hasRoles(roles: string[]): Observable<boolean> | boolean {
    const accessToken = this.storeService.get(AUTH_TOKEN);
    const refreshToken = this.storagePlatformService.getItem(AUTH_TOKEN);

    if (accessToken) {
      return this.waitForUserAndCheckAccess(roles);
    }

    if (!accessToken && refreshToken) {
      return this.authService.refreshTokens().pipe(
        switchMapTo(this.waitForUserAndCheckAccess(roles)),
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

  private waitForUserAndCheckAccess(roles: string[]) {
    return this.authService.fetchMe().pipe(
      map(({ data }) => data.me),
      filter((user) => !isNil(user)),
      map((user) => {
        if (!user.roles.some((role) => roles.includes(role))) {
          this.routerExtensions.navigate(['']);
          return false;
        }

        return true;
      }),
      take(1)
    );
  }
}
