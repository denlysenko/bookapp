import { BOOKMARKS } from '@bookapp/shared';

import { of } from 'rxjs';

import { bookmark } from '../../test-data/bookmark';

export const MockAngularBookmarksService = {
  getBookmarksByBook: jest.fn().mockImplementation(() => ({
    valueChanges: of({
      data: { userBookmarksByBook: [{ type: BOOKMARKS.FAVORITES }] },
    }),
  })),
  getBookmarksByType: jest.fn().mockImplementation(() => ({
    valueChanges: of({
      data: {
        bookmarks: {
          rows: [bookmark],
          count: 1,
        },
      },
    }),
    refetch: jest.fn(),
    fetchMore: jest.fn(),
  })),
  addToBookmarks: jest.fn().mockImplementation(() => of({ addToBookmarks: bookmark })),
  removeFromBookmarks: jest.fn().mockImplementation(() => of({ addToBookmarks: bookmark })),
};
