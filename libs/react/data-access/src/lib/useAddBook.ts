import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery, useMutation } from '@apollo/client/react';

import { Book, BookFormModel } from '@bookapp/shared/interfaces';
import {
  BOOK_FOR_EDIT_QUERY,
  CREATE_BOOK_MUTATION,
  UPDATE_BOOK_MUTATION,
} from '@bookapp/shared/queries';

import { isNil } from 'lodash';

export function useAddBook() {
  const [executeCreateMutation] = useMutation<{ createBook: Book }>(CREATE_BOOK_MUTATION);
  const [executeUpdateMutation] = useMutation<{ updateBook: Book }>(UPDATE_BOOK_MUTATION);
  const [executeBookQuery, { data: bookForEditData, loading }] = useLazyQuery<{ book: Book }>(
    BOOK_FOR_EDIT_QUERY
  );

  const fetchBookForEdit = (slug?: string) => {
    if (!isNil(slug)) {
      executeBookQuery({ variables: { slug } });
    }
  };

  const createBook = async (book: BookFormModel) => {
    const { data, error } = await executeCreateMutation({
      variables: {
        book,
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

  const updateBook = async (id: string, book: Partial<BookFormModel>) => {
    const { data, error } = await executeUpdateMutation({
      variables: {
        id,
        book,
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
    createBook,
    updateBook,
    fetchBookForEdit,
    bookForEdit: bookForEditData?.book ?? null,
    fetchingBook: loading,
  };
}
