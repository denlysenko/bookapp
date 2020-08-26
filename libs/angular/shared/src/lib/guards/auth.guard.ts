import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

import {
  AUTH_TOKEN,
  EnvConfig,
  Environment,
  RouterExtensions,
  StoragePlatformService,
  StoreService,
} from '@bookapp/angular/core';
import { AuthFacade } from '@bookapp/angular/data-access';
import { AuthPayload, REFRESH_TOKEN_HEADER } from '@bookapp/shared';

import { isNil } from 'lodash';

import { Observable, of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMapTo, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly storeService: StoreService,
    private readonly storagePlatformService: StoragePlatformService,
    private readonly authFacade: AuthFacade,
    private readonly routerExtensions: RouterExtensions,
    private readonly http: HttpClient,
    @Inject(Environment) private readonly environment: EnvConfig
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
      return this.http
        .post<AuthPayload>(this.environment.refreshTokenUrl, null, {
          headers: new HttpHeaders().set(REFRESH_TOKEN_HEADER, refreshToken),
        })
        .pipe(
          tap((payload) => {
            this.storeService.set(AUTH_TOKEN, payload.accessToken);
            this.storagePlatformService.setItem(AUTH_TOKEN, payload.refreshToken);
          }),
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
    return this.authFacade.me().pipe(
      map(({ data }) => data.me),
      filter((user) => !isNil(user)),
      mapTo(true),
      take(1)
    );
  }
}
