import { Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import {
  ADD_COMMENT_MUTATION,
  AddCommentResponse,
  ApiResponse,
  Book,
  BOOK_QUERY,
  BookFormModel,
  BooksFilterInput,
  CREATE_BOOK_MUTATION,
  FREE_BOOKS_QUERY,
  PAID_BOOKS_QUERY,
  RATE_BOOK_MUTATION,
  RateBookResponse,
  UPDATE_BOOK_MUTATION
} from '@bookapp/shared';

import { Apollo } from 'apollo-angular';
import { DataProxy } from 'apollo-cache';

export const DEFAULT_SORT_VALUE = 'createdAt_desc';

@Injectable()
export class BooksService {
  constructor(private readonly apollo: Apollo) {}

  create(book: BookFormModel) {
    return this.apollo.mutate<{ createBook: Book }>({
      mutation: CREATE_BOOK_MUTATION,
      variables: {
        book
      }
    });
  }

  update(id: string, book: Partial<BookFormModel>) {
    return this.apollo.mutate<{ updateBook: Book }>({
      mutation: UPDATE_BOOK_MUTATION,
      variables: {
        id,
        book
      }
    });
  }

  getBooks(
    paid: boolean,
    filter?: BooksFilterInput,
    orderBy = DEFAULT_SORT_VALUE,
    skip = 0,
    first = DEFAULT_LIMIT
  ) {
    return this.apollo.watchQuery<{ books: ApiResponse<Book> }>({
      query: paid ? PAID_BOOKS_QUERY : FREE_BOOKS_QUERY,
      variables: {
        paid,
        filter,
        skip,
        first,
        orderBy
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    });
  }

  getBook(slug: string) {
    return this.apollo.watchQuery<{ book: Book }>({
      query: BOOK_QUERY,
      variables: {
        slug
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    });
  }

  rateBook(
    { bookId, rate },
    update: (store: DataProxy, response: { data: RateBookResponse }) => void
  ) {
    return this.apollo.mutate<RateBookResponse>({
      mutation: RATE_BOOK_MUTATION,
      variables: {
        bookId,
        rate
      },
      update
    });
  }

  addComment(
    bookId: string,
    text: string,
    update: (store: DataProxy, response: { data: AddCommentResponse }) => void
  ) {
    return this.apollo.mutate<AddCommentResponse>({
      mutation: ADD_COMMENT_MUTATION,
      variables: {
        bookId,
        text
      },
      update
    });
  }
}
