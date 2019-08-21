import { Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import {
  ApiResponse,
  Book,
  BookFormModel,
  Bookmark,
  BooksFilterInput,
  Comment
} from '@bookapp/shared/models';
import {
  ADD_COMMENT_MUTATION,
  ADD_TO_BOOKMARKS_MUTATION,
  BOOK_QUERY,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  CREATE_BOOK_MUTATION,
  FREE_BOOKS_QUERY,
  PAID_BOOKS_QUERY,
  REMOVE_FROM_BOOKMARKS_MUTATION,
  UPDATE_BOOK_MUTATION
} from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';

export const DEFAULT_SORT_VALUE = 'createdAt_desc';

@Injectable()
export class BooksService {
  constructor(private apollo: Apollo) {}

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

  addComment(bookId: string, text: string, slug: string) {
    return this.apollo.mutate<{ addComment: Comment }>({
      mutation: ADD_COMMENT_MUTATION,
      variables: {
        bookId,
        text
      },
      update: (store, { data: { addComment } }) => {
        const data: { book: Book } = store.readQuery({
          query: BOOK_QUERY,
          variables: {
            slug
          }
        });

        data.book.comments.push(addComment);

        store.writeQuery({
          query: BOOK_QUERY,
          variables: {
            slug
          },
          data
        });
      }
    });
  }

  addToBookmarks({ type, bookId }) {
    return this.apollo.mutate<{ addToBookmarks: Bookmark }>({
      mutation: ADD_TO_BOOKMARKS_MUTATION,
      variables: {
        type,
        bookId
      },
      update: (store, { data: { addToBookmarks } }) => {
        const data: {
          userBookmarksByBook: Array<{ type: string }>;
        } = store.readQuery({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId
          }
        });

        data.userBookmarksByBook.push(addToBookmarks);

        store.writeQuery({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId
          },
          data
        });
      }
    });
  }

  removeFromBookmarks({ type, bookId }) {
    return this.apollo.mutate<{ removeFromBookmarks: Bookmark }>({
      mutation: REMOVE_FROM_BOOKMARKS_MUTATION,
      variables: {
        type,
        bookId
      },
      update: (store, { data: { removeFromBookmarks } }) => {
        const data: {
          userBookmarksByBook: Array<{ type: string }>;
        } = store.readQuery({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId
          }
        });

        data.userBookmarksByBook = data.userBookmarksByBook.filter(
          bookmark => bookmark.type !== removeFromBookmarks.type
        );

        store.writeQuery({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId
          },
          data
        });
      }
    });
  }
}
