import { Injectable } from '@angular/core';

import { AUTH_TOKEN, StoragePlatformService, StoreService } from '@bookapp/angular/core';
import { AuthPayload } from '@bookapp/shared/interfaces';
import { CHANGE_PASSWORD_MUTATION } from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';
import { tap } from 'rxjs/operators';

@Injectable()
export class PasswordService {
  constructor(
    private readonly apollo: Apollo,
    private readonly storagePlatformService: StoragePlatformService,
    private readonly storeService: StoreService
  ) {}

  changePassword(newPassword: string, oldPassword: string) {
    return this.apollo
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
            this.storagePlatformService.setItem(AUTH_TOKEN, refreshToken);
            this.storeService.set(AUTH_TOKEN, accessToken);
          }
        })
      );
  }
}
