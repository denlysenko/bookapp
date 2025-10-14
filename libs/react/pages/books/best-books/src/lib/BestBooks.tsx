import { useEffect, useMemo, useRef } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useBestBooks } from '@bookapp/react/data-access';
import { BooksList, FullPageSpinner } from '@bookapp/react/ui';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';

import { StyledBestBooks } from './StyledBestBooks';

export function BestBooks() {
  const hasMoreItems = useRef(false);
  const skip = useRef(0);
  const { books, loading, loadMore, rateBook } = useBestBooks();

  const transformedBooks = useMemo(() => {
    if (!books) {
      return [];
    }

    return books.rows;
  }, [books]);

  useEffect(() => {
    if (books) {
      hasMoreItems.current = books.rows.length < books.count;
    }
  }, [books]);

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
      <StyledBestBooks>
        <Toolbar disableGutters={true}>
          <Typography component="span">List Of The Best</Typography>
        </Toolbar>
        <div className="view-content">
          <BooksList books={transformedBooks} onLoadMore={onLoadMore} onBookRate={rateBook} />
        </div>
      </StyledBestBooks>
    </>
  );
}

export default BestBooks;
