import { useLazyQuery, useMutation } from '@apollo/client';

import { Book, BookFormModel } from '@bookapp/shared/interfaces';
import {
  BOOK_FOR_EDIT_QUERY,
  CREATE_BOOK_MUTATION,
  UPDATE_BOOK_MUTATION,
} from '@bookapp/shared/queries';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';

export function useAddBook() {
  const [bookForEdit, setBookForEdit] = useState<Book | null>(null);
  const [executeCreateMutation] = useMutation<{ createBook: Book }>(CREATE_BOOK_MUTATION);
  const [executeUpdateMutation] = useMutation<{ updateBook: Book }>(UPDATE_BOOK_MUTATION);
  const [executeBookQuery, { data: bookForEditData, loading }] = useLazyQuery<{ book: Book }>(
    BOOK_FOR_EDIT_QUERY
  );

  useEffect(() => {
    if (!isNil(bookForEditData)) {
      setBookForEdit(bookForEditData.book);
    }
  }, [bookForEditData]);

  const fetchBookForEdit = (slug?: string) => {
    if (isNil(slug)) {
      setBookForEdit(null);
    } else {
      executeBookQuery({ variables: { slug } });
    }
  };

  const createBook = async (book: BookFormModel) => {
    const { data, errors } = await executeCreateMutation({
      variables: {
        book,
      },
    });

    if (data) {
      return true;
    }

    if (errors) {
      return Promise.reject(errors);
    }
  };

  const updateBook = async (id: string, book: Partial<BookFormModel>) => {
    const { data, errors } = await executeUpdateMutation({
      variables: {
        id,
        book,
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
    createBook,
    updateBook,
    fetchBookForEdit,
    bookForEdit,
    fetchingBook: loading,
  };
}
