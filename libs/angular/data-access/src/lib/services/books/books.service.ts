import { inject, Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import {
  ApiResponse,
  Book,
  BooksFilterInput,
  RateBookEvent,
  RateBookResponse,
} from '@bookapp/shared/interfaces';
import { FREE_BOOKS_QUERY, PAID_BOOKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';

import { Apollo, QueryRef } from 'apollo-angular';

export const DEFAULT_SORT_VALUE = 'createdAt_desc';

interface Variables {
  paid: boolean;
  filter?: BooksFilterInput;
  orderBy?: string;
  skip?: number;
  first?: number;
}

@Injectable()
export class BooksService {
  readonly #apollo = inject(Apollo);

  #booksQueryRef: QueryRef<{ books: ApiResponse<Book> }, Variables> | null = null;

  watchBooks(
    paid: boolean,
    filter?: BooksFilterInput,
    orderBy = DEFAULT_SORT_VALUE,
    skip = 0,
    first = DEFAULT_LIMIT
  ) {
    if (!this.#booksQueryRef) {
      this.#booksQueryRef = this.#apollo.watchQuery<{ books: ApiResponse<Book> }, Variables>({
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

    return this.#booksQueryRef.valueChanges;
  }

  getBooks(
    paid: boolean,
    filter?: BooksFilterInput,
    orderBy = DEFAULT_SORT_VALUE,
    skip = 0,
    first = DEFAULT_LIMIT
  ) {
    return this.#apollo.query<{ books: ApiResponse<Book> }>({
      query: paid ? PAID_BOOKS_QUERY : FREE_BOOKS_QUERY,
      variables: {
        paid,
        filter,
        skip,
        first,
        orderBy,
      },
    });
  }

  loadMore(skip: number) {
    this.#booksQueryRef?.fetchMore({
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

  refetch(variables: Partial<Variables>) {
    this.#booksQueryRef?.refetch(variables);
  }

  rateBook({ bookId, rate }: RateBookEvent) {
    return this.#apollo.mutate<RateBookResponse>({
      mutation: RATE_BOOK_MUTATION,
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        if (!this.#booksQueryRef) {
          return;
        }

        this.#booksQueryRef.updateQuery((prevData) => {
          const index = prevData.books.rows.findIndex(({ id }) => id === bookId);

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
