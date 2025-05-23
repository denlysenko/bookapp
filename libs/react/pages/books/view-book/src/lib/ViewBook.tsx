import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { pay } from '@bookapp/react/core';
import { useBook, useBookmarksByUser } from '@bookapp/react/data-access';
import { FullPageSpinner } from '@bookapp/react/ui';
import { Book, BookmarkEvent } from '@bookapp/shared/interfaces';
import { useQueryString } from '@bookapp/utils/react';

import BookComments from './BookComments/BookComments';
import BookDetails from './BookDetails/BookDetails';
import { StyledViewBook } from './StyledViewBook';

export function ViewBook() {
  const { slug } = useParams();
  const query = useQueryString();

  const { book, fetching, addComment, rateBook } = useBook(slug);
  const { bookmarks, addToBookmarks, removeFromBookmarks } = useBookmarksByUser(
    query.get('bookId')
  );

  const [loading, setLoading] = useState(false);

  const addBookmark = useCallback(
    async (event: BookmarkEvent) => {
      await addToBookmarks(event);
    },
    [addToBookmarks]
  );

  const removeBookmark = useCallback(
    async (event: BookmarkEvent) => {
      await removeFromBookmarks(event);
    },
    [removeFromBookmarks]
  );

  const rate = useCallback(
    async (event: { bookId: string; rate: number }) => {
      await rateBook(event);
    },
    [rateBook]
  );

  const submitComment = useCallback(
    async (text: string) => {
      setLoading(true);
      await addComment(book.id, text);
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [book]
  );

  const requestPayment = async ({ price, title, author }: Book) => {
    try {
      const response = await pay({
        total: {
          amount: {
            currency: 'USD',
            value: price.toString(),
          },
          label: `${title} by ${author}`,
        },
      });
      response.complete();
    } catch {
      //
    }
  };

  return (
    <StyledViewBook>
      <Toolbar disableGutters={true}>
        <Typography component="span">Book Details</Typography>
      </Toolbar>
      {fetching && <FullPageSpinner />}
      {book && (
        <div className="view-content">
          <Card>
            <BookDetails
              book={book}
              bookmarks={bookmarks}
              onBookRate={rate}
              onBookmarkAdd={addBookmark}
              onBookmarkRemove={removeBookmark}
              onPaymentRequest={requestPayment}
            />
            <BookComments comments={book.comments} loading={loading} onCommentAdd={submitComment} />
          </Card>
        </div>
      )}
    </StyledViewBook>
  );
}

export default ViewBook;
