import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

import { RouterExtensions, StoragePlatformService, StoreService } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

import { isNil } from 'lodash';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMapTo, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly storeService: StoreService,
    private readonly storagePlatformService: StoragePlatformService,
    private readonly authService: AuthService,
    private readonly routerExtensions: RouterExtensions
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.hasAccess();
  }

  canLoad(): Observable<boolean> | boolean {
    return this.hasAccess();
  }

  private hasAccess() {
    const accessToken = this.storeService.get(AUTH_TOKEN);
    const refreshToken = this.storagePlatformService.getItem(AUTH_TOKEN);

    if (accessToken) {
      return this.waitForUser();
    }

    if (!accessToken && refreshToken) {
      return this.authService.refreshTokens().pipe(
        switchMapTo(this.waitForUser()),
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

  private waitForUser() {
    return this.authService.fetchMe().pipe(
      map(({ data }) => data.me),
      filter((user) => !isNil(user)),
      mapTo(true),
      take(1)
    );
  }
}
