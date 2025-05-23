import { useMutation, useQuery } from '@apollo/client';

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
    notifyOnNetworkStatusChange: true,
  });

  const [executeAddCommentMutation] = useMutation<AddCommentResponse>(ADD_COMMENT_MUTATION);
  const [executeRateBookMutation] = useMutation<RateBookResponse>(RATE_BOOK_MUTATION);

  const addComment = async (bookId: string, text: string) => {
    const { data, errors } = await executeAddCommentMutation({
      variables: {
        bookId,
        text,
      },
      update: (_, { data: { addComment } }) => {
        updateQuery((prevData) => {
          return {
            book: {
              ...prevData.book,
              comments: [...prevData.book.comments, addComment],
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

  const rateBook = async ({ bookId, rate }: RateBookEvent) => {
    const { data, errors } = await executeRateBookMutation({
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        updateQuery((prevData) => {
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

    if (data) {
      return true;
    }

    if (errors) {
      return Promise.reject(errors);
    }
  };

  return {
    book: data && data.book,
    fetching: loading,
    addComment,
    rateBook,
  };
}
