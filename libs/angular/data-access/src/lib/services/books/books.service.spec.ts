// tslint:disable: no-big-function
// tslint:disable: no-identical-functions
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { InMemoryCache } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { Book } from '@bookapp/shared/interfaces';
import { FREE_BOOKS_QUERY, PAID_BOOKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';
import { book } from '@bookapp/testing';

import {
  ApolloTestingController,
  ApolloTestingModule,
  APOLLO_TESTING_CACHE,
} from 'apollo-angular/testing';

import { BooksService, DEFAULT_SORT_VALUE } from './books.service';

const bookWithTypename = { ...book, __typename: 'Book' };
const orderBy = 'createdAt_asc';

describe('BooksService', () => {
  let controller: ApolloTestingController;
  let service: BooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        BooksService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({ addTypename: true }),
        },
      ],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(BooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('watchBooks()', () => {
    it('should watch paid books', (done) => {
      service.watchBooks(true).subscribe(
        ({
          data: {
            books: { rows },
          },
        }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        }
      );

      const op = controller.expectOne(addTypenameToDocument(PAID_BOOKS_QUERY));

      expect(op.operation.variables.paid).toEqual(true);
      expect(op.operation.variables.filter).toBeUndefined();
      expect(op.operation.variables.skip).toEqual(0);
      expect(op.operation.variables.first).toEqual(DEFAULT_LIMIT);
      expect(op.operation.variables.orderBy).toEqual(DEFAULT_SORT_VALUE);

      const data = {
        books: {
          rows: [bookWithTypename],
          count: 1,
          __typename: 'Book',
        },
      };

      op.flush({
        data,
      });

      controller.verify();
    });

    it('should watch free books', (done) => {
      service.watchBooks(false).subscribe(
        ({
          data: {
            books: { rows },
          },
        }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        }
      );

      const op = controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY));

      expect(op.operation.variables.paid).toEqual(false);
      expect(op.operation.variables.filter).toBeUndefined();
      expect(op.operation.variables.skip).toEqual(0);
      expect(op.operation.variables.first).toEqual(DEFAULT_LIMIT);
      expect(op.operation.variables.orderBy).toEqual(DEFAULT_SORT_VALUE);

      op.flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Book',
          },
        },
      });

      controller.verify();
    });

    it('should filter books', (done) => {
      service.watchBooks(false, { field: 'field', search: 'search' }).subscribe(
        ({
          data: {
            books: { rows },
          },
        }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        }
      );

      const op = controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY));

      expect(op.operation.variables.paid).toEqual(false);
      expect(op.operation.variables.filter).toEqual({
        field: 'field',
        search: 'search',
      });
      expect(op.operation.variables.skip).toEqual(0);
      expect(op.operation.variables.first).toEqual(DEFAULT_LIMIT);
      expect(op.operation.variables.orderBy).toEqual(DEFAULT_SORT_VALUE);

      op.flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Book',
          },
        },
      });

      controller.verify();
    });

    it('should skip books', (done) => {
      service.watchBooks(false, undefined, undefined, 10).subscribe(
        ({
          data: {
            books: { rows },
          },
        }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        }
      );

      const op = controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY));

      expect(op.operation.variables.paid).toEqual(false);
      expect(op.operation.variables.filter).toBeUndefined();
      expect(op.operation.variables.skip).toEqual(10);
      expect(op.operation.variables.first).toEqual(DEFAULT_LIMIT);
      expect(op.operation.variables.orderBy).toEqual(DEFAULT_SORT_VALUE);

      op.flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Book',
          },
        },
      });

      controller.verify();
    });

    it('should limit books', (done) => {
      service.watchBooks(false, undefined, undefined, undefined, 20).subscribe(
        ({
          data: {
            books: { rows },
          },
        }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        }
      );

      const op = controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY));

      expect(op.operation.variables.paid).toEqual(false);
      expect(op.operation.variables.filter).toBeUndefined();
      expect(op.operation.variables.skip).toEqual(0);
      expect(op.operation.variables.first).toEqual(20);
      expect(op.operation.variables.orderBy).toEqual(DEFAULT_SORT_VALUE);

      op.flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Book',
          },
        },
      });

      controller.verify();
    });

    it('should order books', (done) => {
      service.watchBooks(false, undefined, 'title_desc').subscribe(
        ({
          data: {
            books: { rows },
          },
        }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        }
      );

      const op = controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY));

      expect(op.operation.variables.paid).toEqual(false);
      expect(op.operation.variables.filter).toBeUndefined();
      expect(op.operation.variables.skip).toEqual(0);
      expect(op.operation.variables.first).toEqual(DEFAULT_LIMIT);
      expect(op.operation.variables.orderBy).toEqual('title_desc');

      op.flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Book',
          },
        },
      });

      controller.verify();
    });
  });

  describe('loadMore()', () => {
    it('should not fetchMore books if QueryRef is not created', () => {
      service.loadMore(10);
      controller.expectNone(addTypenameToDocument(FREE_BOOKS_QUERY));
    });

    it('should fetchMore books', fakeAsync(() => {
      let rows: Book[];

      service.watchBooks(false).subscribe(({ data }) => {
        rows = data.books.rows;
      });

      controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY)).flush({
        data: {
          books: {
            rows: [{ ...bookWithTypename, _id: '1213' }],
            count: 1,
            __typename: 'Books',
          },
        },
      });

      tick();
      expect(rows.length).toEqual(1);

      service.loadMore(10);

      const op = controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY));
      expect(op.operation.variables.skip).toEqual(10);

      op.flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Books',
          },
        },
      });

      tick();
      expect(rows.length).toEqual(2);
    }));
  });

  describe('refetch()', () => {
    it('should not refetch books if QueryRef is not created', () => {
      service.refetch({ orderBy });
      controller.expectNone(addTypenameToDocument(FREE_BOOKS_QUERY));
    });

    it('should refetch books', fakeAsync(() => {
      let rows: Book[];

      service.watchBooks(false).subscribe(({ data }) => {
        if (data.books) {
          rows = data.books.rows;
        }
      });

      controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY)).flush({
        data: {
          books: {
            rows: [{ ...bookWithTypename, _id: '1213' }],
            count: 1,
            __typename: 'Books',
          },
        },
      });

      tick();
      expect(rows[0]._id).toEqual('1213');

      service.refetch({ orderBy });

      const op = controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY));
      expect(op.operation.variables.orderBy).toEqual(orderBy);

      op.flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Books',
          },
        },
      });

      tick();
      expect(rows[0]._id).toEqual(book._id);
    }));
  });

  describe('rateBook()', () => {
    it('should return previous cache if book with passed id is not there', fakeAsync(() => {
      let rows: Book[];

      service.watchBooks(false).subscribe(({ data }) => {
        rows = data.books.rows;
      });

      controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY)).flush({
        data: {
          books: {
            rows: [{ ...bookWithTypename, _id: '1213' }],
            count: 1,
            __typename: 'Books',
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

      expect(rows[0].rating).toEqual(book.rating);
    }));

    it('should update book in cache', fakeAsync(() => {
      let rows: Book[];

      service.watchBooks(false).subscribe(({ data }) => {
        rows = data.books.rows;
      });

      controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY)).flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Books',
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

      expect(rows[0].rating).toEqual(5);
      expect(rows[0].total_rating).toEqual(book.total_rating + 1);
      expect(rows[0].total_rates).toEqual(book.total_rates + 1);
    }));
  });
});
