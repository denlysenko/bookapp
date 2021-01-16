import React, { useRef } from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { useBookmarksByType } from '@bookapp/react/data-access';
import { BooksList, FullPageSpinner } from '@bookapp/react/ui';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { BOOKMARKS } from '@bookapp/shared/enums';
import { ApiResponse, Book, Bookmark } from '@bookapp/shared/interfaces';

import { useBookmarksStyles } from './useBookmarksStyles';

export interface BookmarksProps {
  title: string;
  type: BOOKMARKS;
}

export function Bookmarks({ title, type }: BookmarksProps) {
  const classes = useBookmarksStyles();
  const hasMoreItems = useRef(false);
  const skip = useRef(0);

  const { bookmarks, loading, loadMore, rateBook } = useBookmarksByType(type);

  const toBooks = (data: ApiResponse<Bookmark>): Book[] => {
    const { rows, count } = data;
    hasMoreItems.current = rows.length < count;

    return rows.map((bookmark) => bookmark.book);
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
          <Typography component="span">{title}</Typography>
        </Toolbar>
        <div className="view-content">
          <BooksList
            books={bookmarks && toBooks(bookmarks)}
            onLoadMore={onLoadMore}
            onBookRate={rateBook}
          />
        </div>
      </div>
    </>
  );
}

export default Bookmarks;
