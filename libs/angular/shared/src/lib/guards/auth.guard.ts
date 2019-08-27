import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

import { AUTH_TOKEN, StoragePlatformService } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly storagePlatformService: StoragePlatformService,
    private readonly authService: AuthService
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.hasAccess();
  }

  canLoad(): Observable<boolean> | boolean {
    return this.hasAccess();
  }

  private waitForUser() {
    return this.authService.me().valueChanges.pipe(
      map(({ data }) => {
        if (data && data.me) {
          return true;
        }

        this.authService.logout();
        return false;
      }),
      take(1)
    );
  }

  private hasAccess() {
    const loggedIn = !!this.storagePlatformService.getItem(AUTH_TOKEN);

    if (!loggedIn) {
      this.authService.logout();
      return false;
    }

    return this.waitForUser();
  }
}
