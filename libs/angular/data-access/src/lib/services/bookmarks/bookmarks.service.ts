import { inject, Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { ApiResponse, Bookmark, RateBookEvent, RateBookResponse } from '@bookapp/shared/interfaces';
import {
  ADD_TO_BOOKMARKS_MUTATION,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  BOOKMARKS_QUERY,
  RATE_BOOK_MUTATION,
  REMOVE_FROM_BOOKMARKS_MUTATION,
} from '@bookapp/shared/queries';

import { Apollo, QueryRef } from 'apollo-angular';

@Injectable()
export class BookmarksService {
  readonly #apollo = inject(Apollo);

  #bookmarksByTypeQueryRef: QueryRef<{
    bookmarks: ApiResponse<Bookmark>;
  }> | null = null;

  watchBookmarksByBook(bookId: string) {
    return this.#apollo.watchQuery<{
      userBookmarksByBook: { type: string }[];
    }>({
      query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
      variables: {
        bookId,
      },
    }).valueChanges;
  }

  watchBookmarksByType(type: string) {
    if (!this.#bookmarksByTypeQueryRef) {
      this.#bookmarksByTypeQueryRef = this.#apollo.watchQuery<{ bookmarks: ApiResponse<Bookmark> }>(
        {
          query: BOOKMARKS_QUERY,
          variables: {
            type,
            skip: 0,
            first: DEFAULT_LIMIT,
          },
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true,
        }
      );
    }

    return this.#bookmarksByTypeQueryRef.valueChanges;
  }

  fetchMoreBookmarksByType(skip: number) {
    return this.#bookmarksByTypeQueryRef?.fetchMore({
      variables: {
        skip,
      },
      updateQuery: (previousResult: { bookmarks: ApiResponse<Bookmark> }, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const { rows, count } = fetchMoreResult.bookmarks;

        return {
          bookmarks: {
            count,
            rows: [...previousResult.bookmarks.rows, ...rows],
            __typename: 'BookmarksResponse',
          },
        };
      },
    });
  }

  addToBookmarks({ type, bookId }) {
    return this.#apollo.mutate<{ addToBookmarks: Bookmark }>({
      mutation: ADD_TO_BOOKMARKS_MUTATION,
      variables: {
        type,
        bookId,
      },
      update: (store, { data: { addToBookmarks } }) => {
        const data = store.readQuery<{
          userBookmarksByBook: { type: string }[];
        }>({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId,
          },
        });

        store.writeQuery({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId,
          },
          data: {
            userBookmarksByBook: [...data.userBookmarksByBook, addToBookmarks],
          },
        });
      },
    });
  }

  removeFromBookmarks({ type, bookId }) {
    return this.#apollo.mutate<{ removeFromBookmarks: Bookmark }>({
      mutation: REMOVE_FROM_BOOKMARKS_MUTATION,
      variables: {
        type,
        bookId,
      },
      update: (store, { data: { removeFromBookmarks } }) => {
        const data = store.readQuery<{
          userBookmarksByBook: { type: string }[];
        }>({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId,
          },
        });

        store.writeQuery({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId,
          },
          data: {
            userBookmarksByBook: data.userBookmarksByBook.filter(
              (bookmark) => bookmark.type !== removeFromBookmarks.type
            ),
          },
        });
      },
    });
  }

  rateBook({ bookId, rate }: RateBookEvent) {
    return this.#apollo.mutate<RateBookResponse>({
      mutation: RATE_BOOK_MUTATION,
      variables: {
        bookId,
        rate,
      },
      update: (_, { data: { rateBook } }) => {
        if (!this.#bookmarksByTypeQueryRef) {
          return;
        }

        this.#bookmarksByTypeQueryRef.updateQuery((prevData) => {
          const index = prevData.bookmarks.rows.findIndex(({ book }) => book.id === bookId);

          if (index === -1) {
            return prevData;
          }

          const updatedBook = {
            ...prevData.bookmarks.rows[index].book,
            rating: rateBook.rating,
            total_rates: rateBook.total_rates,
            total_rating: rateBook.total_rating,
          };

          return {
            bookmarks: {
              ...prevData.bookmarks,
              rows: [
                ...prevData.bookmarks.rows.slice(0, index),
                { ...prevData.bookmarks.rows[index], book: updatedBook },
                ...prevData.bookmarks.rows.slice(index + 1),
              ],
            },
          };
        });
      },
    });
  }
}
