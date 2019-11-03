import { Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import {
  ADD_TO_BOOKMARKS_MUTATION,
  ApiResponse,
  Bookmark,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  BOOKMARKS_QUERY,
  REMOVE_FROM_BOOKMARKS_MUTATION
} from '@bookapp/shared';

import { Apollo } from 'apollo-angular';

@Injectable()
export class BookmarksService {
  constructor(private readonly apollo: Apollo) {}

  getBookmarksByBook(bookId: string) {
    return this.apollo.watchQuery<{
      userBookmarksByBook: Array<{ type: string }>;
    }>({
      query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
      variables: {
        bookId
      }
    });
  }

  getBookmarksByType(type: string, skip = 0, first = DEFAULT_LIMIT) {
    return this.apollo.watchQuery<{ bookmarks: ApiResponse<Bookmark> }>({
      query: BOOKMARKS_QUERY,
      variables: {
        type,
        skip,
        first
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
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
