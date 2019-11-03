// tslint:disable: no-big-function
import { TestBed } from '@angular/core/testing';

import {
  ADD_TO_BOOKMARKS_MUTATION,
  BOOKMARKS,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  BOOKMARKS_QUERY,
  REMOVE_FROM_BOOKMARKS_MUTATION
} from '@bookapp/shared';
import { book, bookmark } from '@bookapp/testing';

import { Apollo } from 'apollo-angular';
import {
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { addTypenameToDocument } from 'apollo-utilities';

import { BookmarksService } from './bookmarks.service';

const bookmarkWithTypename = { type: bookmark.type, __typename: 'Bookmark' };

describe('BookmarksService', () => {
  let controller: ApolloTestingController;
  let service: BookmarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        BookmarksService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({ addTypename: true })
        }
      ]
    });

    controller = TestBed.get(ApolloTestingController);
    service = TestBed.get(BookmarksService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBookmarksByBook()', () => {
    it('should get bookmarks by book', done => {
      service
        .getBookmarksByBook(book._id)
        .valueChanges.subscribe(({ data: { userBookmarksByBook } }) => {
          expect(userBookmarksByBook.length).toEqual(1);
          expect(userBookmarksByBook[0].type).toEqual(
            bookmarkWithTypename.type
          );
          done();
        });

      const op = controller.expectOne(
        addTypenameToDocument(BOOKMARKS_BY_USER_AND_BOOK_QUERY)
      );

      expect(op.operation.variables.bookId).toEqual(book._id);

      op.flush({
        data: {
          userBookmarksByBook: [bookmarkWithTypename]
        }
      });

      controller.verify();
    });
  });

  describe('getBookmarksByType()', () => {
    it('should get bookmarks by type', done => {
      service
        .getBookmarksByType(BOOKMARKS.FAVORITES)
        .valueChanges.subscribe(({ data: { bookmarks } }) => {
          expect(bookmarks.rows.length).toEqual(1);
          expect(bookmarks.rows[0].type).toEqual(BOOKMARKS.FAVORITES);
          done();
        });

      const op = controller.expectOne(addTypenameToDocument(BOOKMARKS_QUERY));

      expect(op.operation.variables.type).toEqual(BOOKMARKS.FAVORITES);

      op.flush({
        data: {
          bookmarks: {
            rows: [{ ...bookmarkWithTypename, book: null }],
            count: 1,
            __typename: 'Bookmark'
          }
        }
      });

      controller.verify();
    });
  });

  describe('addToBookmarks()', () => {
    let apollo: Apollo;

    beforeEach(() => {
      apollo = TestBed.get(Apollo);

      apollo
        .query({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId: book._id
          }
        })
        .subscribe();

      controller
        .expectOne(addTypenameToDocument(BOOKMARKS_BY_USER_AND_BOOK_QUERY))
        .flush({
          data: {
            userBookmarksByBook: []
          }
        });
    });

    it('should call ADD_TO_BOOKMARKS_MUTATION', done => {
      service
        .addToBookmarks({ type: BOOKMARKS.FAVORITES, bookId: book._id })
        .subscribe(({ data: { addToBookmarks } }) => {
          expect(addToBookmarks.type).toEqual(BOOKMARKS.FAVORITES);
          done();
        });

      const op = controller.expectOne(
        addTypenameToDocument(ADD_TO_BOOKMARKS_MUTATION)
      );

      expect(op.operation.variables.bookId).toEqual(book._id);
      expect(op.operation.variables.type).toEqual(BOOKMARKS.FAVORITES);

      op.flush({
        data: {
          addToBookmarks: bookmarkWithTypename
        }
      });

      controller.verify();
    });

    it('should add new bookmark in bookmarks list in store', done => {
      service
        .addToBookmarks({ type: BOOKMARKS.FAVORITES, bookId: book._id })
        .subscribe(() => {
          apollo
            .query<{ userBookmarksByBook: Array<{ type: number }> }>({
              query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
              variables: {
                bookId: book._id
              }
            })
            .subscribe(({ data: { userBookmarksByBook } }) => {
              expect(userBookmarksByBook.length).toEqual(1);
              expect(userBookmarksByBook[0].type).toEqual(bookmark.type);
              done();
            });
        });

      controller
        .expectOne(addTypenameToDocument(ADD_TO_BOOKMARKS_MUTATION))
        .flush({
          data: {
            addToBookmarks: bookmarkWithTypename
          }
        });

      controller.verify();
    });
  });

  describe('removeFromBookmarks()', () => {
    let apollo: Apollo;

    beforeEach(() => {
      apollo = TestBed.get(Apollo);

      apollo
        .query({
          query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
          variables: {
            bookId: book._id
          }
        })
        .subscribe();

      controller
        .expectOne(addTypenameToDocument(BOOKMARKS_BY_USER_AND_BOOK_QUERY))
        .flush({
          data: {
            userBookmarksByBook: [bookmarkWithTypename]
          }
        });
    });

    it('should call REMOVE_FROM_BOOKMARKS_MUTATION', done => {
      service
        .removeFromBookmarks({ type: BOOKMARKS.FAVORITES, bookId: book._id })
        .subscribe(({ data: { removeFromBookmarks } }) => {
          expect(removeFromBookmarks.type).toEqual(BOOKMARKS.FAVORITES);
          done();
        });

      const op = controller.expectOne(
        addTypenameToDocument(REMOVE_FROM_BOOKMARKS_MUTATION)
      );

      expect(op.operation.variables.bookId).toEqual(book._id);
      expect(op.operation.variables.type).toEqual(BOOKMARKS.FAVORITES);

      op.flush({
        data: {
          removeFromBookmarks: bookmarkWithTypename
        }
      });

      controller.verify();
    });

    it('should remove bookmark from bookmarks list in store', done => {
      service
        .removeFromBookmarks({ type: BOOKMARKS.FAVORITES, bookId: book._id })
        .subscribe(() => {
          apollo
            .query<{ userBookmarksByBook: Array<{ type: number }> }>({
              query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
              variables: {
                bookId: book._id
              }
            })
            .subscribe(({ data: { userBookmarksByBook } }) => {
              expect(userBookmarksByBook.length).toEqual(0);
              done();
            });
        });

      controller
        .expectOne(addTypenameToDocument(REMOVE_FROM_BOOKMARKS_MUTATION))
        .flush({
          data: {
            removeFromBookmarks: bookmarkWithTypename
          }
        });

      controller.verify();
    });
  });
});
