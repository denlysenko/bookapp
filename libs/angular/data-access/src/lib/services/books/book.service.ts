import { Injectable } from '@angular/core';

import {
  AddCommentResponse,
  ADD_COMMENT_MUTATION,
  Book,
  BOOK_FOR_EDIT_QUERY,
  BOOK_QUERY,
  RateBookEvent,
  RateBookResponse,
  RATE_BOOK_MUTATION,
} from '@bookapp/shared';

import { Apollo, QueryRef } from 'apollo-angular';

import { isNil } from 'lodash';

@Injectable()
export class BookService {
  private bookQueryRef: QueryRef<{ book: Book }> | null = null;

  constructor(private readonly apollo: Apollo) {}

  watchBook(slug: string) {
    if (isNil(this.bookQueryRef)) {
      this.bookQueryRef = this.apollo.watchQuery<{ book: Book }>({
        query: BOOK_QUERY,
        variables: {
          slug,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      });
    }

    return this.bookQueryRef.valueChanges;
  }

  fetchBook(slug: string) {
    return this.apollo.query<{ book: Book }>({
      query: BOOK_QUERY,
      variables: {
        slug,
      },
    });
  }

  fetchBookForEdit(slug: string) {
    return this.apollo.query<{ book: Book }>({
      query: BOOK_FOR_EDIT_QUERY,
      variables: {
        slug,
      },
    });
  }

  rateBook({ bookId, rate }: RateBookEvent) {
    return this.apollo.mutate<RateBookResponse>({
      mutation: RATE_BOOK_MUTATION,
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        if (isNil(this.bookQueryRef)) {
          return;
        }

        this.bookQueryRef.updateQuery((prevData) => {
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
    return this.apollo.mutate<AddCommentResponse>({
      mutation: ADD_COMMENT_MUTATION,
      variables: {
        bookId,
        text,
      },
      update: (_, { data: { addComment } }) => {
        if (isNil(this.bookQueryRef)) {
          return;
        }

        this.bookQueryRef.updateQuery((prevData) => {
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
