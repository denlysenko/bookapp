import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import { useAddBook } from '@bookapp/react/data-access';
import { FullPageSpinner, useFeedback } from '@bookapp/react/ui';
import { BookFormModel } from '@bookapp/shared/interfaces';

import { isNil } from 'lodash';

import AddBookForm from './AddBookForm/AddBookForm';
import { useAddBookStyles } from './useAddBookStyles';

export const BOOK_CREATED = 'Book created!';
export const BOOK_UPDATED = 'Book updated!';

export const AddBook = () => {
  const classes = useAddBookStyles();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const { bookForEdit, fetchBookForEdit, fetchingBook, createBook, updateBook } = useAddBook();
  const { showFeedback } = useFeedback();

  useEffect(() => {
    fetchBookForEdit(slug);
  }, [slug]);

  const submitForm = async (bookFormValue: BookFormModel | Partial<BookFormModel>) => {
    setLoading(true);
    try {
      isNil(bookForEdit)
        ? await createBook(bookFormValue as BookFormModel)
        : await updateBook(bookForEdit._id, bookFormValue);
      setLoading(false);
      showFeedback(isNil(bookForEdit) ? BOOK_CREATED : BOOK_UPDATED);
    } catch (errors) {
      setLoading(false);
      setError(errors[errors.length - 1]);
    }
  };

  return (
    <>
      {fetchingBook && <FullPageSpinner />}
      <div className={`${classes.root} view-content`}>
        <Card>
          <CardHeader title={isNil(bookForEdit) ? 'Add a Book' : 'Edit the Book'} />
          <CardContent>
            <AddBookForm book={bookForEdit} loading={loading} error={error} onSubmit={submitForm} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddBook;
