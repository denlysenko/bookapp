import { gql } from '@apollo/client';

import {
  BookFragment,
  CreatedBookFragment,
  FreeBooksFragment,
  PaidBooksFragment,
} from './fragments';

export const CREATE_BOOK_MUTATION = gql`
  mutation createBook($book: BookInput!) {
    createBook(book: $book) {
      ...CreatedBook
    }
  }
  ${CreatedBookFragment}
`;

export const UPDATE_BOOK_MUTATION = gql`
  mutation updateBook($id: ID!, $book: BookInput!) {
    updateBook(id: $id, book: $book) {
      ...CreatedBook
    }
  }
  ${CreatedBookFragment}
`;

export const BOOK_FOR_EDIT_QUERY = gql`
  query bookForEdit($slug: String!) {
    book(slug: $slug) {
      ...CreatedBook
    }
  }
  ${CreatedBookFragment}
`;

export const FREE_BOOKS_QUERY = gql`
  query freeBooks(
    $paid: Boolean!
    $filter: FilterInput
    $skip: Int
    $first: Int
    $orderBy: BookOrderByInput
  ) {
    books(paid: $paid, filter: $filter, skip: $skip, first: $first, orderBy: $orderBy) {
      count
      rows {
        ...FreeBooks
      }
    }
  }
  ${FreeBooksFragment}
`;

export const PAID_BOOKS_QUERY = gql`
  query paidBooks(
    $paid: Boolean!
    $filter: FilterInput
    $skip: Int
    $first: Int
    $orderBy: BookOrderByInput
  ) {
    books(paid: $paid, filter: $filter, skip: $skip, first: $first, orderBy: $orderBy) {
      count
      rows {
        ...PaidBooks
      }
    }
  }
  ${PaidBooksFragment}
`;

export const RATE_BOOK_MUTATION = gql`
  mutation rateBook($bookId: ID!, $rate: Int!) {
    rateBook(id: $bookId, rate: $rate) {
      rating
      total_rates
      total_rating
    }
  }
`;

export const BOOK_QUERY = gql`
  query book($slug: String!) {
    book(slug: $slug) {
      ...Book
    }
  }
  ${BookFragment}
`;

export const BEST_BOOKS_QUERY = gql`
  query bestBooks($skip: Int, $first: Int) {
    bestBooks(skip: $skip, first: $first) {
      count
      rows {
        ...PaidBooks
      }
    }
  }
  ${PaidBooksFragment}
`;
