import { Injectable } from '@angular/core';

import {
  AUTH_TOKEN,
  RouterExtensions,
  StoragePlatformService,
  StoreService,
} from '@bookapp/angular/core';
import { SignupCredentials } from '@bookapp/shared';

import { Apollo } from 'apollo-angular';

import { shareReplay, tap } from 'rxjs/operators';

import { LoginMutation } from './LoginMutation';
import { LogoutMutation } from './LogoutMutation';
import { MeQuery } from './MeQuery';
import { SignupMutation } from './SignupMutation';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly loginMutation: LoginMutation,
    private readonly signupMutation: SignupMutation,
    private readonly meQuery: MeQuery,
    private readonly logoutMutation: LogoutMutation,
    private readonly apollo: Apollo,
    private readonly storagePlatformService: StoragePlatformService,
    private readonly storeService: StoreService,
    private readonly routerExtensions: RouterExtensions
  ) {}

  login(email: string, password: string) {
    return this.loginMutation
      .mutate({
        email,
        password,
      })
      .pipe(
        tap(({ data }) => {
          if (data) {
            const { accessToken, refreshToken } = data.login;
            this.storagePlatformService.setItem(AUTH_TOKEN, refreshToken);
            this.storeService.set(AUTH_TOKEN, accessToken);
          }
        })
      );
  }

  signup(user: SignupCredentials) {
    return this.signupMutation
      .mutate({
        user,
      })
      .pipe(
        tap(({ data }) => {
          if (data) {
            const { accessToken, refreshToken } = data.signup;
            this.storagePlatformService.setItem(AUTH_TOKEN, refreshToken);
            this.storeService.set(AUTH_TOKEN, accessToken);
          }
        })
      );
  }

  watchMe() {
    return this.meQuery.watch().valueChanges.pipe(shareReplay(1));
  }

  me() {
    return this.meQuery.fetch();
  }

  logout() {
    return this.logoutMutation
      .mutate({
        refreshToken: this.storagePlatformService.getItem(AUTH_TOKEN),
      })
      .pipe(
        tap(async ({ data }) => {
          if (data.logout) {
            await this.apollo.client.clearStore();
            this.storagePlatformService.removeItem(AUTH_TOKEN);
            this.storeService.remove(AUTH_TOKEN);
            this.routerExtensions.navigate(['auth'], {
              // for nativescript
              clearHistory: true,
              transition: {
                name: 'flip',
                duration: 300,
                curve: 'linear',
              },
            });
          }
        })
      );
  }
}
