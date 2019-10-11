import { BOOKMARKS } from '@bookapp/shared';

import { of } from 'rxjs';

import { bookmark } from '../../test-data/bookmark';

export const MockAngularBookmarksService = {
  getBookmarks: jest.fn().mockImplementation(() => ({
    valueChanges: of({
      data: { userBookmarksByBook: [{ type: BOOKMARKS.FAVORITES }] }
    })
  })),
  addToBookmarks: jest
    .fn()
    .mockImplementation(() => of({ addToBookmarks: bookmark })),
  removeFromBookmarks: jest
    .fn()
    .mockImplementation(() => of({ addToBookmarks: bookmark }))
};
