import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { useBook, useBookmarks } from '@bookapp/react/data-access';
import { FullPageSpinner } from '@bookapp/react/ui';
import { BookmarkEvent } from '@bookapp/shared/interfaces';
import { useQueryString } from '@bookapp/utils/react';

import BookComments from './BookComments/BookComments';
import BookDetails from './BookDetails/BookDetails';
import { useViewBookStyles } from './useViewBookStyles';

export function ViewBook() {
  const classes = useViewBookStyles();
  const { slug } = useParams();
  const query = useQueryString();

  const { book, fetching, addComment, rateBook } = useBook(slug);
  const { bookmarks, addToBookmarks, removeFromBookmarks } = useBookmarks(query.get('bookId'));

  const [loading, setLoading] = useState(false);

  const addBookmark = useCallback(async (event: BookmarkEvent) => {
    await addToBookmarks(event);
  }, []);

  const removeBookmark = useCallback(async (event: BookmarkEvent) => {
    await removeFromBookmarks(event);
  }, []);

  const rate = useCallback(async (event: { bookId: string; rate: number }) => {
    await rateBook(event);
  }, []);

  const submitComment = useCallback(
    async (text: string) => {
      setLoading(true);
      await addComment(book._id, text);
      setLoading(false);
    },
    [book]
  );

  return (
    <div className={classes.root}>
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
            />
            <BookComments comments={book.comments} loading={loading} onCommentAdd={submitComment} />
          </Card>
        </div>
      )}
    </div>
  );
}

export default ViewBook;
