import { Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import {
  ApiResponse,
  BEST_BOOKS_QUERY,
  Book,
  RateBookEvent,
  RateBookResponse,
  RATE_BOOK_MUTATION,
} from '@bookapp/shared';

import { Apollo, QueryRef } from 'apollo-angular';

import { isNil } from 'lodash';

@Injectable()
export class BestBooksService {
  private bestBooksQueryRef: QueryRef<{ bestBooks: ApiResponse<Book> }> | null = null;

  constructor(private readonly apollo: Apollo) {}

  watchBooks(skip = 0, first = DEFAULT_LIMIT) {
    if (isNil(this.bestBooksQueryRef)) {
      this.bestBooksQueryRef = this.apollo.watchQuery<{ bestBooks: ApiResponse<Book> }>({
        query: BEST_BOOKS_QUERY,
        variables: {
          skip,
          first,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      });
    }

    return this.bestBooksQueryRef.valueChanges;
  }

  loadMore(skip: number) {
    if (isNil(this.bestBooksQueryRef)) {
      return;
    }

    this.bestBooksQueryRef.fetchMore({
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
    return this.apollo.mutate<RateBookResponse>({
      mutation: RATE_BOOK_MUTATION,
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        if (isNil(this.bestBooksQueryRef)) {
          return;
        }

        this.bestBooksQueryRef.updateQuery((prevData) => {
          const index = prevData.bestBooks.rows.findIndex(({ _id }) => _id === bookId);

          if (index === -1) {
            return prevData;
          }

          if (rateBook.rating < 5) {
            const rows = [...prevData.bestBooks.rows];
            rows.splice(index, 1);

            return {
              bestBooks: {
                rows,
                count: prevData.bestBooks.count - 1,
              },
            };
          }

          const updatedBook = {
            ...prevData.bestBooks.rows[index],
            rating: rateBook.rating,
            total_rates: rateBook.total_rates,
            total_rating: rateBook.total_rating,
          };

          return {
            bestBooks: {
              ...prevData.bestBooks,
              rows: [
                ...prevData.bestBooks.rows.slice(0, index),
                updatedBook,
                ...prevData.bestBooks.rows.slice(index + 1),
              ],
            },
          };
        });
      },
    });
  }
}
