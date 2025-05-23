import { useMutation, useQuery } from '@apollo/client';

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
      notifyOnNetworkStatusChange: true,
    }
  );

  const [executeRateBookMutation] = useMutation<RateBookResponse>(RATE_BOOK_MUTATION);

  const rateBook = async ({ bookId, rate }: RateBookEvent) => {
    const { data, errors } = await executeRateBookMutation({
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        updateQuery((prevData) => {
          const index = prevData.bookmarks.rows.findIndex(({ book }) => book.id === bookId);

          if (index === -1) {
            return prevData;
          }

          const updatedBook = {
            ...prevData.bookmarks.rows[index].book,
            rating: rateBook.rating,
            total_rates: rateBook.total_rates,
            total_rating: rateBook.total_rating,
          };

          return {
            bookmarks: {
              ...prevData.bookmarks,
              rows: [
                ...prevData.bookmarks.rows.slice(0, index),
                { ...prevData.bookmarks.rows[index], book: updatedBook },
                ...prevData.bookmarks.rows.slice(index + 1),
              ],
            },
          };
        });
      },
    });

    if (data) {
      return true;
    }

    if (errors) {
      return Promise.reject(errors);
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
