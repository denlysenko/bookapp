import { useEffect, useReducer } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { store } from '@bookapp/react/core';
import { DEFAULT_SORT_VALUE, useBooks } from '@bookapp/react/data-access';
import { BooksActionTypes, booksReducer, BooksState } from '@bookapp/react/state';
import { BooksFilter, BooksList, FullPageSpinner } from '@bookapp/react/ui';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { BooksFilter as IBooksFilter } from '@bookapp/shared/interfaces';

import { StyledBuyBooks } from './StyledBuyBooks';

const FILTER_KEY = 'BUY_BOOKS';

const initialState: BooksState = {
  hasMoreItems: false,
  skip: 0,
  filter: store.get(FILTER_KEY) || {
    searchQuery: '',
    sortValue: DEFAULT_SORT_VALUE,
  },
};

export const BuyBooks = () => {
  const [{ hasMoreItems, skip, filter }, dispatch] = useReducer(
    booksReducer,
    initialState,
    (state) => {
      return store.get(FILTER_KEY) ? { ...state, filter: { ...store.get(FILTER_KEY) } } : state;
    }
  );

  const { data, loading, loadMore, rateBook } = useBooks(
    true,
    {
      field: 'title',
      search: filter.searchQuery,
    },
    filter.sortValue
  );

  useEffect(() => {
    if (data && data.rows && data.rows.length > 0) {
      dispatch({
        type: BooksActionTypes.BOOKS_LOADED,
        payload: data.rows.length !== data.count,
      });
    }
  }, [data]);

  useEffect(() => {
    store.set(FILTER_KEY, filter);
  }, [filter]);

  const onSearch = (searchQuery: string) => {
    dispatch({
      type: BooksActionTypes.SEARCH_BOOKS,
      payload: searchQuery,
    });
  };

  const onSort = (sortValue: string) => {
    dispatch({
      type: BooksActionTypes.SORT_BOOKS,
      payload: sortValue as IBooksFilter['sortValue'],
    });
  };

  const onLoadMore = () => {
    if (!hasMoreItems || loading) {
      return;
    }

    const newSkip = skip + DEFAULT_LIMIT;

    loadMore(newSkip);
    dispatch({
      type: BooksActionTypes.LOAD_MORE_BOOKS,
      payload: newSkip,
    });
  };

  return (
    <>
      {loading && <FullPageSpinner />}
      <StyledBuyBooks>
        <Toolbar disableGutters={true}>
          <Typography component="span">Browse Books To Buy</Typography>
        </Toolbar>
        <Toolbar disableGutters={true}>
          <BooksFilter filter={filter} onSearch={onSearch} onSort={onSort} />
        </Toolbar>
        <div className="view-content">
          <BooksList books={data && data.rows} onLoadMore={onLoadMore} onBookRate={rateBook} />
        </div>
      </StyledBuyBooks>
    </>
  );
};

export default BuyBooks;
