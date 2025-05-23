import { inject, Injectable } from '@angular/core';

import { StoragePlatformService, StoreService } from '@bookapp/angular/core';
import { AUTH_TOKEN } from '@bookapp/shared/constants';
import { AuthPayload } from '@bookapp/shared/interfaces';
import { CHANGE_PASSWORD_MUTATION } from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  readonly #apollo = inject(Apollo);
  readonly #storagePlatformService = inject(StoragePlatformService);
  readonly #storeService = inject(StoreService);

  changePassword(newPassword: string, oldPassword: string) {
    return this.#apollo
      .mutate<{ changePassword: AuthPayload }>({
        mutation: CHANGE_PASSWORD_MUTATION,
        variables: {
          newPassword,
          oldPassword,
        },
      })
      .pipe(
        tap(({ data }) => {
          if (data) {
            const {
              changePassword: { accessToken, refreshToken },
            } = data;
            this.#storagePlatformService.setItem(AUTH_TOKEN, refreshToken);
            this.#storeService.set(AUTH_TOKEN, accessToken);
          }
        })
      );
  }
}
