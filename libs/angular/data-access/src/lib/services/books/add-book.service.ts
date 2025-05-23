import { inject, Injectable } from '@angular/core';

import { Book, BookFormModel } from '@bookapp/shared/interfaces';
import { CREATE_BOOK_MUTATION, UPDATE_BOOK_MUTATION } from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';

@Injectable({ providedIn: 'root' })
export class AddBookService {
  readonly #apollo = inject(Apollo);

  create(book: BookFormModel) {
    return this.#apollo.mutate<{ createBook: Book }>({
      mutation: CREATE_BOOK_MUTATION,
      variables: {
        book,
      },
    });
  }

  update(id: string, book: Partial<BookFormModel>) {
    return this.#apollo.mutate<{ updateBook: Book }>({
      mutation: UPDATE_BOOK_MUTATION,
      variables: {
        id,
        book,
      },
    });
  }
}
