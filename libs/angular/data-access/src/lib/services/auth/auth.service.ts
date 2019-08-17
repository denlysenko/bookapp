import { Injectable } from '@angular/core';

import { AUTH_TOKEN, StoragePlatformService } from '@bookapp/angular/core';
import { AuthPayload, SignupCredentials, User } from '@bookapp/shared/models';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(
    private readonly apollo: Apollo,
    private readonly storagePlatformService: StoragePlatformService
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
              login: { token }
            } = data;
            this.storagePlatformService.setItem(AUTH_TOKEN, token);
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
              signup: { token }
            } = data;
            this.storagePlatformService.setItem(AUTH_TOKEN, token);
          }
        })
      );
  }

  async logout() {
    this.storagePlatformService.removeItem(AUTH_TOKEN);
    await this.apollo.getClient().resetStore();
  }
}
