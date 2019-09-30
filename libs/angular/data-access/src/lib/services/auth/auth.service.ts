import { Injectable } from '@angular/core';

import {
  AUTH_TOKEN,
  RouterExtensions,
  StoragePlatformService,
  StoreService
} from '@bookapp/angular/core';
import {
  AuthPayload,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  SIGNUP_MUTATION,
  SignupCredentials,
  User
} from '@bookapp/shared';

import { Apollo } from 'apollo-angular';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(
    private readonly apollo: Apollo,
    private readonly storagePlatformService: StoragePlatformService,
    private readonly routerExtensions: RouterExtensions,
    private readonly storeService: StoreService
  ) {}

  login(email: string, password: string) {
    return this.apollo
      .mutate<{ login: AuthPayload }>({
        mutation: LOGIN_MUTATION,
        variables: {
          email,
          password
        }
      })
      .pipe(
        tap(({ data }) => {
          if (data) {
            const {
              login: { accessToken, refreshToken }
            } = data;
            this.storagePlatformService.setItem(AUTH_TOKEN, refreshToken);
            this.storeService.set(AUTH_TOKEN, accessToken);
          }
        })
      );
  }

  signup(user: SignupCredentials) {
    return this.apollo
      .mutate<{ signup: AuthPayload }>({
        mutation: SIGNUP_MUTATION,
        variables: {
          user
        }
      })
      .pipe(
        tap(({ data }) => {
          if (data) {
            const {
              signup: { accessToken, refreshToken }
            } = data;
            this.storagePlatformService.setItem(AUTH_TOKEN, refreshToken);
            this.storeService.set(AUTH_TOKEN, accessToken);
          }
        })
      );
  }

  me() {
    return this.apollo.watchQuery<{ me: User }>({
      query: ME_QUERY
    });
  }

  logout() {
    return this.apollo
      .mutate<{ logout: boolean }>({
        mutation: LOGOUT_MUTATION,
        variables: {
          refreshToken: this.storagePlatformService.getItem(AUTH_TOKEN)
        }
      })
      .pipe(
        tap(async ({ data }) => {
          if (data.logout) {
            this.storagePlatformService.removeItem(AUTH_TOKEN);
            this.storeService.remove(AUTH_TOKEN);
            this.routerExtensions.navigate(['auth'], {
              // for nativescript
              clearHistory: true,
              transition: {
                name: 'flip',
                duration: 300,
                curve: 'linear'
              }
            });

            await this.apollo.getClient().clearStore();
          }
        })
      );
  }
}
