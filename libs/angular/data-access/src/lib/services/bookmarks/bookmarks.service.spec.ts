// tslint:disable: no-big-function
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { InMemoryCache } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';

import {
  ADD_TO_BOOKMARKS_MUTATION,
  Bookmark,
  BOOKMARKS,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  BOOKMARKS_QUERY,
  REMOVE_FROM_BOOKMARKS_MUTATION,
  RATE_BOOK_MUTATION,
} from '@bookapp/shared';
import { book, bookmark } from '@bookapp/testing';

import {
  ApolloTestingController,
  ApolloTestingModule,
  APOLLO_TESTING_CACHE,
} from 'apollo-angular/testing';

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
          useValue: new InMemoryCache({ addTypename: true }),
        },
      ],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(BookmarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('watchBookmarksByBook()', () => {
    it('should watch bookmarks by book', (done) => {
      service.watchBookmarksByBook(book._id).subscribe(({ data: { userBookmarksByBook } }) => {
        expect(userBookmarksByBook.length).toEqual(1);
        expect(userBookmarksByBook[0].type).toEqual(bookmarkWithTypename.type);
        done();
      });

      const op = controller.expectOne(addTypenameToDocument(BOOKMARKS_BY_USER_AND_BOOK_QUERY));

      expect(op.operation.variables.bookId).toEqual(book._id);

      op.flush({
        data: {
          userBookmarksByBook: [bookmarkWithTypename],
        },
      });

      controller.verify();
    });
  });

  describe('watchBookmarksByType()', () => {
    it('should watch bookmarks by type', (done) => {
      service.watchBookmarksByType(BOOKMARKS.FAVORITES).subscribe(({ data: { bookmarks } }) => {
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
            __typename: 'Bookmark',
          },
        },
      });

      controller.verify();
    });
  });

  describe('fetchMoreBookmarksByType()', () => {
    it('should not fetchMore bookmarks if QueryRef is not created', () => {
      service.fetchMoreBookmarksByType(10);
      controller.expectNone(addTypenameToDocument(BOOKMARKS_QUERY));
    });

    it('should fetchMore bookmarks', fakeAsync(() => {
      let rows: Bookmark[];

      service.watchBookmarksByType(BOOKMARKS.FAVORITES).subscribe(({ data }) => {
        rows = data.bookmarks.rows;
      });

      controller.expectOne(addTypenameToDocument(BOOKMARKS_QUERY)).flush({
        data: {
          bookmarks: {
            rows: [{ ...bookmarkWithTypename, book: null }],
            count: 1,
            __typename: 'Bookmark',
          },
        },
      });

      tick();
      expect(rows.length).toEqual(1);

      service.fetchMoreBookmarksByType(10);

      const op = controller.expectOne(addTypenameToDocument(BOOKMARKS_QUERY));
      expect(op.operation.variables.skip).toEqual(10);

      op.flush({
        data: {
          bookmarks: {
            rows: [{ ...bookmarkWithTypename, book: null }],
            count: 1,
            __typename: 'Bookmark',
          },
        },
      });

      tick();
      expect(rows.length).toEqual(2);
    }));
  });

  describe('addToBookmarks()', () => {
    it('should add new bookmark in cache', fakeAsync(() => {
      let rows: { type: string }[];

      service.watchBookmarksByBook(book._id).subscribe(({ data }) => {
        rows = data.userBookmarksByBook;
      });

      controller.expectOne(addTypenameToDocument(BOOKMARKS_BY_USER_AND_BOOK_QUERY)).flush({
        data: {
          userBookmarksByBook: [],
        },
      });

      tick();
      expect(rows.length).toEqual(0);

      service
        .addToBookmarks({ type: BOOKMARKS.FAVORITES, bookId: book._id })
        .subscribe(({ data: { addToBookmarks } }) => {
          expect(addToBookmarks.type).toEqual(BOOKMARKS.FAVORITES);
        });

      const op = controller.expectOne(addTypenameToDocument(ADD_TO_BOOKMARKS_MUTATION));

      expect(op.operation.variables.bookId).toEqual(book._id);
      expect(op.operation.variables.type).toEqual(BOOKMARKS.FAVORITES);

      op.flush({
        data: {
          addToBookmarks: bookmarkWithTypename,
        },
      });

      tick();
      expect(rows.length).toEqual(1);

      controller.verify();
    }));
  });

  describe('removeFromBookmarks()', () => {
    let rows: { type: string }[];

    it('should remove bookmark from cache', fakeAsync(() => {
      service.watchBookmarksByBook(book._id).subscribe(({ data }) => {
        rows = data.userBookmarksByBook;
      });

      controller.expectOne(addTypenameToDocument(BOOKMARKS_BY_USER_AND_BOOK_QUERY)).flush({
        data: {
          userBookmarksByBook: [bookmarkWithTypename],
        },
      });

      tick();
      expect(rows.length).toEqual(1);

      service.removeFromBookmarks({ type: BOOKMARKS.FAVORITES, bookId: book._id }).subscribe();

      controller.expectOne(addTypenameToDocument(REMOVE_FROM_BOOKMARKS_MUTATION)).flush({
        data: {
          removeFromBookmarks: bookmarkWithTypename,
        },
      });

      tick();
      expect(rows.length).toEqual(0);

      controller.verify();
    }));
  });

  describe('rateBook()', () => {
    it('should return previous cache if book with passed id is not there', fakeAsync(() => {
      let rows: Bookmark[];

      service.watchBookmarksByType(BOOKMARKS.FAVORITES).subscribe(({ data }) => {
        rows = data.bookmarks.rows;
      });

      controller.expectOne(addTypenameToDocument(BOOKMARKS_QUERY)).flush({
        data: {
          bookmarks: {
            rows: [
              {
                ...bookmarkWithTypename,
                book: {
                  ...book,
                  __typename: 'Book',
                },
              },
            ],
            count: 1,
            __typename: 'Bookmark',
          },
        },
      });

      tick();

      service.rateBook({ bookId: '123', rate: 3 }).subscribe();

      const op = controller.expectOne(addTypenameToDocument(RATE_BOOK_MUTATION));

      expect(op.operation.variables.bookId).toEqual('123');
      expect(op.operation.variables.rate).toEqual(3);

      op.flush({
        data: {
          rateBook: {
            total_rating: book.total_rating + 1,
            total_rates: book.total_rates + 1,
            rating: 3,
          },
        },
      });

      tick();

      expect(rows[0].book.rating).toEqual(book.rating);
    }));

    it('should update book in cache', fakeAsync(() => {
      let rows: Bookmark[];

      service.watchBookmarksByType(BOOKMARKS.FAVORITES).subscribe(({ data }) => {
        rows = data.bookmarks.rows;
      });

      controller.expectOne(addTypenameToDocument(BOOKMARKS_QUERY)).flush({
        data: {
          bookmarks: {
            rows: [
              {
                ...bookmarkWithTypename,
                book: {
                  ...book,
                  __typename: 'Book',
                },
              },
            ],
            count: 1,
            __typename: 'Bookmark',
          },
        },
      });

      tick();

      service.rateBook({ bookId: book._id, rate: 5 }).subscribe();

      controller.expectOne(addTypenameToDocument(RATE_BOOK_MUTATION)).flush({
        data: {
          rateBook: {
            total_rating: book.total_rating + 1,
            total_rates: book.total_rates + 1,
            rating: 5,
          },
        },
      });

      tick();

      expect(rows[0].book.rating).toEqual(5);
      expect(rows[0].book.total_rating).toEqual(book.total_rating + 1);
      expect(rows[0].book.total_rates).toEqual(book.total_rates + 1);
    }));
  });
});
