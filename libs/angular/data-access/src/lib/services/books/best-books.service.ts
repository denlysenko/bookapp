import { inject, Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { ApiResponse, Book, RateBookEvent, RateBookResponse } from '@bookapp/shared/interfaces';
import { BEST_BOOKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';

import { Apollo, QueryRef } from 'apollo-angular';

@Injectable({ providedIn: 'root' })
export class BestBooksService {
  readonly #apollo = inject(Apollo);

  #bestBooksQueryRef: QueryRef<{ bestBooks: ApiResponse<Book> }> | null = null;

  watchBooks(skip = 0, first = DEFAULT_LIMIT) {
    if (!this.#bestBooksQueryRef) {
      this.#bestBooksQueryRef = this.#apollo.watchQuery<{ bestBooks: ApiResponse<Book> }>({
        query: BEST_BOOKS_QUERY,
        variables: {
          skip,
          first,
        },
        fetchPolicy: 'network-only',
      });
    }

    return this.#bestBooksQueryRef.valueChanges;
  }

  loadMore(skip: number) {
    this.#bestBooksQueryRef?.fetchMore({
      variables: {
        skip,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const { rows, count } = fetchMoreResult.bestBooks;

        return {
          bestBooks: {
            count,
            rows: [...previousResult.bestBooks.rows, ...rows],
            __typename: 'BestBookResponse',
          },
        };
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
        if (!this.#bestBooksQueryRef) {
          return;
        }

        this.#bestBooksQueryRef.updateQuery((_, { complete, previousData }) => {
          if (!complete) {
            return undefined;
          }

          const index = previousData.bestBooks.rows.findIndex(({ id }) => id === bookId);

          if (index === -1) {
            return previousData;
          }

          if (rateBook.rating < 5) {
            const rows = [...previousData.bestBooks.rows];
            rows.splice(index, 1);

            return {
              bestBooks: {
                rows,
                count: previousData.bestBooks.count - 1,
              },
            };
          }

          const updatedBook = {
            ...previousData.bestBooks.rows[index],
            rating: rateBook.rating,
            total_rates: rateBook.total_rates,
            total_rating: rateBook.total_rating,
          };

          return {
            bestBooks: {
              ...previousData.bestBooks,
              rows: [
                ...previousData.bestBooks.rows.slice(0, index),
                updatedBook,
                ...previousData.bestBooks.rows.slice(index + 1),
              ],
            },
          };
        });
      },
    });
  }
}
