import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { useAddBook } from '@bookapp/react/data-access';
import { FullPageSpinner, useFeedback } from '@bookapp/react/ui';
import { BookFormModel } from '@bookapp/shared/interfaces';

import AddBookForm from './AddBookForm/AddBookForm';
import { StyledAddBook } from './StyledAddBook';

export const BOOK_CREATED = 'Book created!';
export const BOOK_UPDATED = 'Book updated!';

export const AddBook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const { bookForEdit, fetchBookForEdit, fetchingBook, createBook, updateBook } = useAddBook();
  const { showFeedback } = useFeedback();

  useEffect(() => {
    fetchBookForEdit(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const submitForm = async (bookFormValue: BookFormModel | Partial<BookFormModel>) => {
    setLoading(true);
    try {
      !bookForEdit
        ? await createBook(bookFormValue as BookFormModel)
        : await updateBook(bookForEdit.id, bookFormValue);
      setLoading(false);
      showFeedback(!bookForEdit ? BOOK_CREATED : BOOK_UPDATED);
    } catch (errors) {
      setLoading(false);
      setError(errors[errors.length - 1]);
    }
  };

  return (
    <>
      {fetchingBook && <FullPageSpinner />}
      <StyledAddBook className="view-content">
        <Card>
          <CardHeader title={!bookForEdit ? 'Add a Book' : 'Edit the Book'} />
          <CardContent>
            <AddBookForm book={bookForEdit} loading={loading} error={error} onSubmit={submitForm} />
          </CardContent>
        </Card>
      </StyledAddBook>
    </>
  );
};

export default AddBook;
