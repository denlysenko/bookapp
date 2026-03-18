import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation, useQuery } from '@apollo/client/react';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import {
  ApiResponse,
  Book,
  BooksFilterInput,
  RateBookEvent,
  RateBookResponse,
} from '@bookapp/shared/interfaces';
import { FREE_BOOKS_QUERY, PAID_BOOKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';

export const DEFAULT_SORT_VALUE = 'createdAt_desc';

export function useBooks(
  paid: boolean,
  filter?: BooksFilterInput,
  orderBy = DEFAULT_SORT_VALUE,
  skip = 0,
  first = DEFAULT_LIMIT
) {
  const [executeMutation] = useMutation<RateBookResponse>(RATE_BOOK_MUTATION);
  const { data, loading, refetch, fetchMore, updateQuery } = useQuery<{ books: ApiResponse<Book> }>(
    paid ? PAID_BOOKS_QUERY : FREE_BOOKS_QUERY,
    {
      variables: {
        paid,
        filter,
        skip,
        first,
        orderBy,
      },
      fetchPolicy: 'network-only',
    }
  );

  const loadMore = (skip: number) => {
    fetchMore({
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
  };

  const rateBook = async ({ bookId, rate }: RateBookEvent) => {
    const { data, error } = await executeMutation({
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        updateQuery((_, { complete, previousData }) => {
          if (!complete) {
            return undefined;
          }

          const index = previousData.books.rows.findIndex(({ id }) => id === bookId);

          if (index === -1) {
            return previousData;
          }

          const updatedBook = {
            ...previousData.books.rows[index],
            rating: rateBook.rating,
            total_rates: rateBook.total_rates,
            total_rating: rateBook.total_rating,
          };

          return {
            books: {
              ...previousData.books,
              rows: [
                ...previousData.books.rows.slice(0, index),
                updatedBook,
                ...previousData.books.rows.slice(index + 1),
              ],
            },
          };
        });
      },
    });

    if (data) {
      return true;
    }

    if (error) {
      if (CombinedGraphQLErrors.is(error)) {
        return Promise.reject(error.errors);
      }

      return Promise.reject(error);
    }
  };

  return {
    loading,
    data: data && data.books,
    refetch,
    loadMore,
    rateBook,
  };
}
