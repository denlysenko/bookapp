import { BOOKMARKS } from '@bookapp/shared/enums';

import { of } from 'rxjs';

import { bookmark } from '../../test-data/bookmark';

export const MockAngularBookmarksService = {
  watchBookmarksByBook: jest.fn().mockImplementation(() =>
    of({
      data: { userBookmarksByBook: [{ type: BOOKMARKS.FAVORITES }] },
    })
  ),
  watchBookmarksByType: jest.fn().mockImplementation(() =>
    of({
      data: {
        bookmarks: {
          rows: [bookmark],
          count: 1,
        },
      },
    })
  ),
  fetchMoreBookmarksByType: jest.fn(),
  addToBookmarks: jest.fn().mockImplementation(() => of({ addToBookmarks: bookmark })),
  removeFromBookmarks: jest.fn().mockImplementation(() => of({ addToBookmarks: bookmark })),
  rateBook: jest.fn(() => of({})),
};
