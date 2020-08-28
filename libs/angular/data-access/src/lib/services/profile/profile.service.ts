import { Injectable } from '@angular/core';

import { ME_QUERY, Reading, UPDATE_USER_MUTATION, User } from '@bookapp/shared';

import { Apollo } from 'apollo-angular';

@Injectable()
export class ProfileService {
  constructor(private readonly apollo: Apollo) {}

  update(id: string, user: Partial<User>) {
    return this.apollo.mutate<{ updateUser: User }>({
      mutation: UPDATE_USER_MUTATION,
      variables: {
        id,
        user,
      },
    });
  }

  saveReading(id: string, reading: Reading) {
    return this.apollo.mutate<{ updateUser: User }>({
      mutation: UPDATE_USER_MUTATION,
      variables: {
        id,
        user: { reading },
      },
      update: (store, { data: { updateUser } }) => {
        const data: { me: User } = store.readQuery({
          query: ME_QUERY,
        });

        store.writeQuery({
          query: ME_QUERY,
          data: {
            me: {
              ...data.me,
              reading: updateUser.reading,
            },
          },
        });
      },
    });
  }
}
