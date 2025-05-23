import { Injectable, inject } from '@angular/core';

import {
  AddCommentResponse,
  Book,
  RateBookEvent,
  RateBookResponse,
} from '@bookapp/shared/interfaces';
import {
  ADD_COMMENT_MUTATION,
  BOOK_FOR_EDIT_QUERY,
  BOOK_QUERY,
  RATE_BOOK_MUTATION,
} from '@bookapp/shared/queries';

import { Apollo, QueryRef } from 'apollo-angular';

@Injectable({ providedIn: 'root' })
export class BookService {
  readonly #apollo = inject(Apollo);

  #bookQueryRef: QueryRef<{ book: Book }> | null = null;

  watchBook(slug: string) {
    if (!this.#bookQueryRef) {
      this.#bookQueryRef = this.#apollo.watchQuery<{ book: Book }>({
        query: BOOK_QUERY,
        variables: {
          slug,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      });
    }

    return this.#bookQueryRef.valueChanges;
  }

  fetchBook(slug: string) {
    return this.#apollo.query<{ book: Book }>({
      query: BOOK_QUERY,
      variables: {
        slug,
      },
    });
  }

  fetchBookForEdit(slug: string) {
    return this.#apollo.query<{ book: Book }>({
      query: BOOK_FOR_EDIT_QUERY,
      variables: {
        slug,
      },
    });
  }

  rateBook({ bookId, rate }: RateBookEvent) {
    return this.#apollo.mutate<RateBookResponse>({
      mutation: RATE_BOOK_MUTATION,
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        if (!this.#bookQueryRef) {
          return;
        }

        this.#bookQueryRef.updateQuery((prevData) => {
          return {
            book: {
              ...prevData.book,
              rating: rateBook.rating,
              total_rates: rateBook.total_rates,
              total_rating: rateBook.total_rating,
            },
          };
        });
      },
    });
  }

  addComment(bookId: string, text: string) {
    return this.#apollo.mutate<AddCommentResponse>({
      mutation: ADD_COMMENT_MUTATION,
      variables: {
        bookId,
        text,
      },
      update: (_, { data: { addComment } }) => {
        if (!this.#bookQueryRef) {
          return;
        }

        this.#bookQueryRef.updateQuery((prevData) => {
          return {
            book: {
              ...prevData.book,
              comments: [...prevData.book.comments, addComment],
            },
          };
        });
      },
    });
  }
}
