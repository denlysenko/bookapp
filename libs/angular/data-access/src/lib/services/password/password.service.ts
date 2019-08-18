import { Injectable } from '@angular/core';

import { CHANGE_PASSWORD_MUTATION } from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';

@Injectable()
export class PasswordService {
  constructor(private apollo: Apollo) {}

  changePassword(newPassword: string, oldPassword: string) {
    return this.apollo.mutate<{ changePassword: true }>({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: {
        newPassword,
        oldPassword
      }
    });
  }
}
