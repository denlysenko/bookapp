import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation, useQuery } from '@apollo/client/react';

import {
  AddCommentResponse,
  Book,
  RateBookEvent,
  RateBookResponse,
} from '@bookapp/shared/interfaces';
import { ADD_COMMENT_MUTATION, BOOK_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';

export function useBook(slug: string) {
  const { data, loading, updateQuery } = useQuery<{ book: Book }>(BOOK_QUERY, {
    variables: {
      slug,
    },
    fetchPolicy: 'network-only',
  });

  const [executeAddCommentMutation] = useMutation<AddCommentResponse>(ADD_COMMENT_MUTATION);
  const [executeRateBookMutation] = useMutation<RateBookResponse>(RATE_BOOK_MUTATION);

  const addComment = async (bookId: string, text: string) => {
    const { data, error } = await executeAddCommentMutation({
      variables: {
        bookId,
        text,
      },
      update: (_, { data: { addComment } }) => {
        updateQuery((_, { complete, previousData }) => {
          if (!complete) {
            return undefined;
          }

          return {
            book: {
              ...previousData.book,
              comments: [...previousData.book.comments, addComment],
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

          return {
            book: {
              ...previousData.book,
              rating: rateBook.rating,
              total_rates: rateBook.total_rates,
              total_rating: rateBook.total_rating,
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
    book: data && data.book,
    fetching: loading,
    addComment,
    rateBook,
  };
}
