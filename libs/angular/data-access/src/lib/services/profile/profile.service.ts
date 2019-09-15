import { Injectable } from '@angular/core';

import { UPDATE_USER_MUTATION, User } from '@bookapp/shared';

import { Apollo } from 'apollo-angular';

@Injectable()
export class ProfileService {
  constructor(private readonly apollo: Apollo) {}

  update(id: string, user: Partial<User>) {
    return this.apollo.mutate<{ updateUser: User }>({
      mutation: UPDATE_USER_MUTATION,
      variables: {
        id,
        user
      }
    });
  }
}
