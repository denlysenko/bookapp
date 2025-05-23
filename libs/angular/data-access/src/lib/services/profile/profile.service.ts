import { inject, Injectable } from '@angular/core';

import { Reading, User } from '@bookapp/shared/interfaces';
import { ME_QUERY, UPDATE_USER_MUTATION } from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly #apollo = inject(Apollo);

  update(id: string, user: Partial<User>) {
    return this.#apollo.mutate<{ updateUser: User }>({
      mutation: UPDATE_USER_MUTATION,
      variables: {
        id,
        user,
      },
    });
  }

  saveReading(id: string, reading: Reading) {
    return this.#apollo.mutate<{ updateUser: User }>({
      mutation: UPDATE_USER_MUTATION,
      variables: {
        id,
        user: { reading },
      },
      update: (store, { data: { updateUser } }) => {
        const data = store.readQuery<{ me: User }>({
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
