import { BooksFilter } from '@bookapp/shared/interfaces';

export enum BooksActionTypes {
  BOOKS_LOADED = 'BOOKS_LOADED',
  SORT_BOOKS = 'SORT_BOOKS',
  SEARCH_BOOKS = 'SEARCH_BOOKS',
  LOAD_MORE_BOOKS = 'LOAD_MORE_BOOKS',
}

interface BooksLoadedAction {
  type: BooksActionTypes.BOOKS_LOADED;
  payload: boolean;
}

interface SortBooksAction {
  type: BooksActionTypes.SORT_BOOKS;
  payload: BooksFilter['sortValue'];
}

interface SearchBooksAction {
  type: BooksActionTypes.SEARCH_BOOKS;
  payload: string;
}

interface LoadMoreAction {
  type: BooksActionTypes.LOAD_MORE_BOOKS;
  payload: number;
}

export type BooksAction = BooksLoadedAction | SortBooksAction | SearchBooksAction | LoadMoreAction;
