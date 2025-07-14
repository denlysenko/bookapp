import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import {
  Environment,
  RouterExtensions,
  StoragePlatformService,
  StoreService,
} from '@bookapp/angular/core';
import { AUTH_TOKEN, REFRESH_TOKEN_HEADER } from '@bookapp/shared/constants';
import { AuthPayload, SignupCredentials, User } from '@bookapp/shared/interfaces';
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  SIGNUP_MUTATION,
} from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #apollo = inject(Apollo);
  readonly #storagePlatformService = inject(StoragePlatformService);
  readonly #routerExtensions = inject(RouterExtensions);
  readonly #storeService = inject(StoreService);
  readonly #http = inject(HttpClient);
  readonly #environment = inject(Environment);

  login(email: string, password: string) {
    return this.#apollo
      .mutate<{ login: AuthPayload }>({
        mutation: LOGIN_MUTATION,
        variables: {
          email,
          password,
        },
      })
      .pipe(
        tap(({ data }) => {
          if (data) {
            const { accessToken, refreshToken } = data.login;
            this.#storagePlatformService.setItem(AUTH_TOKEN, refreshToken);
            this.#storeService.set(AUTH_TOKEN, accessToken);
          }
        })
      );
  }

  signup(user: SignupCredentials) {
    return this.#apollo
      .mutate<{ signup: AuthPayload }>({
        mutation: SIGNUP_MUTATION,
        variables: {
          user,
        },
      })
      .pipe(
        tap(({ data }) => {
          if (data) {
            const { accessToken, refreshToken } = data.signup;
            this.#storagePlatformService.setItem(AUTH_TOKEN, refreshToken);
            this.#storeService.set(AUTH_TOKEN, accessToken);
          }
        })
      );
  }

  watchMe() {
    return this.#apollo.watchQuery<{ me: User }>({
      query: ME_QUERY,
    }).valueChanges;
  }

  fetchMe() {
    return this.#apollo.query<{ me: User }>({
      query: ME_QUERY,
    });
  }

  refreshTokens() {
    const refreshToken = this.#storagePlatformService.getItem(AUTH_TOKEN);

    return this.#http
      .post<AuthPayload>(this.#environment.refreshTokenUrl, null, {
        headers: { [REFRESH_TOKEN_HEADER]: refreshToken },
      })
      .pipe(
        tap((payload) => {
          this.#storeService.set(AUTH_TOKEN, payload.accessToken);
          this.#storagePlatformService.setItem(AUTH_TOKEN, payload.refreshToken);
        })
      );
  }

  logout() {
    return this.#apollo
      .mutate<{ logout: boolean }>({
        mutation: LOGOUT_MUTATION,
        variables: {
          refreshToken: this.#storagePlatformService.getItem(AUTH_TOKEN),
        },
      })
      .pipe(
        tap(async ({ data }) => {
          if (data.logout) {
            await this.#apollo.client.clearStore();

            this.#storagePlatformService.removeItem(AUTH_TOKEN);
            this.#storeService.remove(AUTH_TOKEN);
            this.#routerExtensions.navigate(['auth'], {
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
