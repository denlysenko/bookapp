import { Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import {
  ApiResponse,
  Book,
  BooksFilterInput,
  RateBookEvent,
  RateBookResponse,
} from '@bookapp/shared/interfaces';
import { FREE_BOOKS_QUERY, PAID_BOOKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';

import { Apollo, QueryRef } from 'apollo-angular';

import { isNil } from 'lodash';
import { EmptyObject } from 'apollo-angular/types';

export const DEFAULT_SORT_VALUE = 'createdAt_desc';

@Injectable()
export class BooksService {
  private booksQueryRef: QueryRef<{ books: ApiResponse<Book> }> | null = null;

  constructor(private readonly apollo: Apollo) {}

  watchBooks(
    paid: boolean,
    filter?: BooksFilterInput,
    orderBy = DEFAULT_SORT_VALUE,
    skip = 0,
    first = DEFAULT_LIMIT
  ) {
    if (isNil(this.booksQueryRef)) {
      this.booksQueryRef = this.apollo.watchQuery<{ books: ApiResponse<Book> }>({
        query: paid ? PAID_BOOKS_QUERY : FREE_BOOKS_QUERY,
        variables: {
          paid,
          filter,
          skip,
          first,
          orderBy,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      });
    }

    return this.booksQueryRef.valueChanges;
  }

  loadMore(skip: number) {
    if (isNil(this.booksQueryRef)) {
      return;
    }

    this.booksQueryRef.fetchMore({
      variables: {
        skip,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const { rows, count } = fetchMoreResult.books;

        return {
          books: {
            count,
            rows: [...previousResult.books.rows, ...rows],
            __typename: 'BookResponse',
          },
        };
      },
    });
  }

  refetch(variables: EmptyObject) {
    if (isNil(this.booksQueryRef)) {
      return;
    }

    this.booksQueryRef.refetch(variables);
  }

  rateBook({ bookId, rate }: RateBookEvent) {
    return this.apollo.mutate<RateBookResponse>({
      mutation: RATE_BOOK_MUTATION,
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        if (isNil(this.booksQueryRef)) {
          return;
        }

        this.booksQueryRef.updateQuery((prevData) => {
          const index = prevData.books.rows.findIndex(({ _id }) => _id === bookId);

          if (index === -1) {
            return prevData;
          }

          const updatedBook = {
            ...prevData.books.rows[index],
            rating: rateBook.rating,
            total_rates: rateBook.total_rates,
            total_rating: rateBook.total_rating,
          };

          return {
            books: {
              ...prevData.books,
              rows: [
                ...prevData.books.rows.slice(0, index),
                updatedBook,
                ...prevData.books.rows.slice(index + 1),
              ],
            },
          };
        });
      },
    });
  }
}
