import { useEffect, useMemo, useRef } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useBookmarksByType } from '@bookapp/react/data-access';
import { BooksList, FullPageSpinner } from '@bookapp/react/ui';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { BOOKMARKS } from '@bookapp/shared/enums';

import { StyledBookmarks } from './StyledBookmarks';

export interface BookmarksProps {
  title: string;
  type: BOOKMARKS;
}

export function Bookmarks({ title, type }: BookmarksProps) {
  const hasMoreItems = useRef(false);
  const skip = useRef(0);

  const { bookmarks, loading, loadMore, rateBook } = useBookmarksByType(type);

  const books = useMemo(() => {
    if (!bookmarks) {
      return [];
    }

    return bookmarks.rows.map((bookmark) => bookmark.book);
  }, [bookmarks]);

  useEffect(() => {
    if (bookmarks) {
      const { rows, count } = bookmarks;
      hasMoreItems.current = rows.length < count;
    }
  }, [bookmarks]);

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
      <StyledBookmarks>
        <Toolbar disableGutters={true}>
          <Typography component="span">{title}</Typography>
        </Toolbar>
        <div className="view-content">
          <BooksList books={books} onLoadMore={onLoadMore} onBookRate={rateBook} />
        </div>
      </StyledBookmarks>
    </>
  );
}

export default Bookmarks;
