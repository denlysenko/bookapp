import React, { useRef } from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { useBestBooks } from '@bookapp/react/data-access';
import { BooksList, FullPageSpinner } from '@bookapp/react/ui';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { ApiResponse, Book } from '@bookapp/shared/interfaces';

import { useBestBooksStyles } from './useBestBooksStyles';

export function BestBooks() {
  const classes = useBestBooksStyles();
  const hasMoreItems = useRef(false);
  const skip = useRef(0);
  const { books, loading, loadMore, rateBook } = useBestBooks();

  const toBooks = (data: ApiResponse<Book>): Book[] => {
    const { rows, count } = data;
    hasMoreItems.current = rows.length < count;

    return rows;
  };

  const onLoadMore = () => {
    if (!hasMoreItems.current || loading) {
      return;
    }

    skip.current += DEFAULT_LIMIT;
    loadMore(skip.current);
  };

  return (
    <>
      {loading && <FullPageSpinner />}
      <div className={classes.root}>
        <Toolbar disableGutters={true}>
          <Typography component="span">List Of The Best</Typography>
        </Toolbar>
        <div className="view-content">
          <BooksList
            books={books && toBooks(books)}
            onLoadMore={onLoadMore}
            onBookRate={rateBook}
          />
        </div>
      </div>
    </>
  );
}

export default BestBooks;
