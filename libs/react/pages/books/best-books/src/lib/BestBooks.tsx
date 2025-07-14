import { useRef } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useBestBooks } from '@bookapp/react/data-access';
import { BooksList, FullPageSpinner } from '@bookapp/react/ui';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { ApiResponse, Book } from '@bookapp/shared/interfaces';

import { StyledBestBooks } from './StyledBestBooks';

export function BestBooks() {
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
      <StyledBestBooks>
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
      </StyledBestBooks>
    </>
  );
}

export default BestBooks;
