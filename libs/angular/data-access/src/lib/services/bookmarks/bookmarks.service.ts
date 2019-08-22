import { Injectable } from '@angular/core';

import { Bookmark } from '@bookapp/shared/models';
import {
  ADD_TO_BOOKMARKS_MUTATION,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  REMOVE_FROM_BOOKMARKS_MUTATION
} from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';

@Injectable()
export class BookmarksService {
  constructor(private readonly apollo: Apollo) {}

  getBookmarks(bookId: string) {
    return this.apollo.watchQuery<{
      userBookmarksByBook: Array<{ type: string }>;
    }>({
      query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
      variables: {
        bookId
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
