import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation, useQuery } from '@apollo/client/react';

import { Bookmark, BookmarkEvent } from '@bookapp/shared/interfaces';
import {
  ADD_TO_BOOKMARKS_MUTATION,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  REMOVE_FROM_BOOKMARKS_MUTATION,
} from '@bookapp/shared/queries';

export function useBookmarksByUser(bookId: string) {
  const { data, updateQuery } = useQuery<{
    userBookmarksByBook: { type: string }[];
  }>(BOOKMARKS_BY_USER_AND_BOOK_QUERY, {
    variables: {
      bookId,
    },
  });

  const [executeAddToBookmarksMutation] = useMutation<{ addToBookmarks: Bookmark }>(
    ADD_TO_BOOKMARKS_MUTATION
  );

  const [executeRemoveFromBookmarksMutation] = useMutation<{ removeFromBookmarks: Bookmark }>(
    REMOVE_FROM_BOOKMARKS_MUTATION
  );

  const addToBookmarks = async ({ type, bookId }: BookmarkEvent) => {
    const { data, error } = await executeAddToBookmarksMutation({
      variables: {
        type,
        bookId,
      },
      update: (_, { data: { addToBookmarks } }) => {
        updateQuery((_, { complete, previousData }) => {
          if (!complete) {
            return undefined;
          }

          return {
            userBookmarksByBook: [...previousData.userBookmarksByBook, addToBookmarks],
          };
        });
      },
    });

    if (data) {
      return true;
    }

    if (error) {
      if (CombinedGraphQLErrors.is(error)) {
        return Promise.reject(error.errors);
      }

      return Promise.reject(error);
    }
  };

  const removeFromBookmarks = async ({ type, bookId }: BookmarkEvent) => {
    const { data, error } = await executeRemoveFromBookmarksMutation({
      variables: {
        type,
        bookId,
      },
      update: (_, { data: { removeFromBookmarks } }) => {
        updateQuery((_, { complete, previousData }) => {
          if (!complete) {
            return undefined;
          }

          return {
            userBookmarksByBook: previousData.userBookmarksByBook.filter(
              (bookmark) => bookmark.type !== removeFromBookmarks.type
            ),
          };
        });
      },
    });

    if (data) {
      return true;
    }

    if (error) {
      if (CombinedGraphQLErrors.is(error)) {
        return Promise.reject(error.errors);
      }

      return Promise.reject(error);
    }
  };

  return {
    bookmarks:
      data && data.userBookmarksByBook && data.userBookmarksByBook.map((bookmark) => bookmark.type),
    addToBookmarks,
    removeFromBookmarks,
  };
}
