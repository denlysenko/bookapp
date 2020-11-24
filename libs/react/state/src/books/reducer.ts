import { BooksFilter } from '@bookapp/shared/interfaces';

import { BooksAction, BooksActionTypes } from './actions';

export interface BooksState {
  hasMoreItems: boolean;
  skip: number;
  filter: BooksFilter;
}

export const booksReducer = (state: BooksState, action: BooksAction): BooksState => {
  switch (action.type) {
    case BooksActionTypes.BOOKS_LOADED: {
      return {
        ...state,
        hasMoreItems: action.payload,
      };
    }

    case BooksActionTypes.SORT_BOOKS: {
      return {
        ...state,
        skip: 0,
        filter: {
          ...state.filter,
          sortValue: action.payload,
        },
      };
    }

    case BooksActionTypes.SEARCH_BOOKS: {
      return {
        ...state,
        skip: 0,
        filter: {
          ...state.filter,
          searchQuery: action.payload,
        },
      };
    }

    case BooksActionTypes.LOAD_MORE_BOOKS: {
      return {
        ...state,
        skip: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
