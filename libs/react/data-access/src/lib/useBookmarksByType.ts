import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation, useQuery } from '@apollo/client/react';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { BOOKMARKS } from '@bookapp/shared/enums';
import { ApiResponse, Bookmark, RateBookEvent, RateBookResponse } from '@bookapp/shared/interfaces';
import { BOOKMARKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';

export function useBookmarksByType(type: BOOKMARKS) {
  const { data, loading, fetchMore, updateQuery } = useQuery<{ bookmarks: ApiResponse<Bookmark> }>(
    BOOKMARKS_QUERY,
    {
      variables: {
        type,
        skip: 0,
        first: DEFAULT_LIMIT,
      },
      fetchPolicy: 'network-only',
    }
  );

  const [executeRateBookMutation] = useMutation<RateBookResponse>(RATE_BOOK_MUTATION);

  const rateBook = async ({ bookId, rate }: RateBookEvent) => {
    const { data, error } = await executeRateBookMutation({
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        updateQuery((_, { complete, previousData }) => {
          if (!complete) {
            return undefined;
          }

          const index = previousData.bookmarks.rows.findIndex(({ book }) => book.id === bookId);

          if (index === -1) {
            return previousData;
          }

          const updatedBook = {
            ...previousData.bookmarks.rows[index].book,
            rating: rateBook.rating,
            total_rates: rateBook.total_rates,
            total_rating: rateBook.total_rating,
          };

          return {
            bookmarks: {
              ...previousData.bookmarks,
              rows: [
                ...previousData.bookmarks.rows.slice(0, index),
                { ...previousData.bookmarks.rows[index], book: updatedBook },
                ...previousData.bookmarks.rows.slice(index + 1),
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
    bookmarks: data && data.bookmarks,
    loading,
    loadMore: (skip: number) => {
      fetchMore({
        variables: {
          skip,
        },
      });
    },
    rateBook,
  };
}
