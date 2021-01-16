import { useMutation, useQuery } from '@apollo/client';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { ApiResponse, Book, RateBookEvent, RateBookResponse } from '@bookapp/shared/interfaces';
import { BEST_BOOKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';

// tslint:disable: no-shadowed-variable
export function useBestBooks() {
  const { data, loading, fetchMore, updateQuery } = useQuery<{ bestBooks: ApiResponse<Book> }>(
    BEST_BOOKS_QUERY,
    {
      variables: {
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
          const index = prevData.bestBooks.rows.findIndex((book) => book._id === bookId);

          if (index === -1) {
            return prevData;
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

    if (data) {
      return true;
    }

    if (errors) {
      return Promise.reject(errors);
    }
  };

  return {
    books: data && data.bestBooks,
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
