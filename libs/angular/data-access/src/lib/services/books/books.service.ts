import { Injectable } from '@angular/core';

import { MutationUpdaterFn } from '@apollo/client/core';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import {
  AddCommentResponse,
  ADD_COMMENT_MUTATION,
  ApiResponse,
  BEST_BOOKS_QUERY,
  Book,
  BookFormModel,
  BooksFilterInput,
  BOOK_QUERY,
  CREATE_BOOK_MUTATION,
  FREE_BOOKS_QUERY,
  PAID_BOOKS_QUERY,
  RateBookResponse,
  RATE_BOOK_MUTATION,
  UPDATE_BOOK_MUTATION,
} from '@bookapp/shared';

import { Apollo } from 'apollo-angular';

export const DEFAULT_SORT_VALUE = 'createdAt_desc';

const fetchPolicy = 'network-only';

@Injectable()
export class BooksService {
  constructor(private readonly apollo: Apollo) {}

  create(book: BookFormModel) {
    return this.apollo.mutate<{ createBook: Book }>({
      mutation: CREATE_BOOK_MUTATION,
      variables: {
        book,
      },
    });
  }

  update(id: string, book: Partial<BookFormModel>) {
    return this.apollo.mutate<{ updateBook: Book }>({
      mutation: UPDATE_BOOK_MUTATION,
      variables: {
        id,
        book,
      },
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
        orderBy,
      },
      fetchPolicy,
      notifyOnNetworkStatusChange: true,
    });
  }

  getBook(slug: string) {
    return this.apollo.watchQuery<{ book: Book }>({
      query: BOOK_QUERY,
      variables: {
        slug,
      },
      fetchPolicy,
      notifyOnNetworkStatusChange: true,
    });
  }

  getBestBooks(skip = 0, first = DEFAULT_LIMIT) {
    return this.apollo.watchQuery<{ bestBooks: ApiResponse<Book> }>({
      query: BEST_BOOKS_QUERY,
      variables: {
        skip,
        first,
      },
      fetchPolicy,
      notifyOnNetworkStatusChange: true,
    });
  }

  rateBook({ bookId, rate }, update: MutationUpdaterFn<RateBookResponse>) {
    return this.apollo.mutate<RateBookResponse>({
      mutation: RATE_BOOK_MUTATION,
      variables: {
        bookId,
        rate,
      },
      update,
    });
  }

  addComment(bookId: string, text: string, update: MutationUpdaterFn<AddCommentResponse>) {
    return this.apollo.mutate<AddCommentResponse>({
      mutation: ADD_COMMENT_MUTATION,
      variables: {
        bookId,
        text,
      },
      update,
    });
  }
}
