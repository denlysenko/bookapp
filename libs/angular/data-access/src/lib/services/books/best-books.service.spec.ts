import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { InMemoryCache } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';

import { BEST_BOOKS_QUERY, Book, RATE_BOOK_MUTATION } from '@bookapp/shared';
import { book } from '@bookapp/testing';

import {
  ApolloTestingController,
  ApolloTestingModule,
  APOLLO_TESTING_CACHE,
} from 'apollo-angular/testing';

import { BestBooksService } from './best-books.service';

const bookWithTypename = { ...book, __typename: 'Book' };

// tslint:disable: no-identical-functions
// tslint:disable: no-big-function
describe('BestBooksService', () => {
  let controller: ApolloTestingController;
  let service: BestBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        BestBooksService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({ addTypename: true }),
        },
      ],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(BestBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('watchBooks()', () => {
    it('should watch on best book', (done) => {
      service.watchBooks().subscribe(({ data }) => {
        const [b] = data.bestBooks.rows;
        expect(b._id).toEqual(book._id);
        done();
      });

      const op = controller.expectOne(addTypenameToDocument(BEST_BOOKS_QUERY));

      op.flush({
        data: {
          bestBooks: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'BestBooks',
          },
        },
      });

      controller.verify();
    });
  });

  describe('loadMore()', () => {
    it('should not fetchMore books if QueryRef is not created', () => {
      service.loadMore(10);
      controller.expectNone(addTypenameToDocument(BEST_BOOKS_QUERY));
    });

    it('should fetchMore books', fakeAsync(() => {
      let rows: Book[];

      service.watchBooks().subscribe(({ data }) => {
        rows = data.bestBooks.rows;
      });

      controller.expectOne(addTypenameToDocument(BEST_BOOKS_QUERY)).flush({
        data: {
          bestBooks: {
            rows: [{ ...bookWithTypename, _id: '1213' }],
            count: 1,
            __typename: 'BestBooks',
          },
        },
      });

      tick();
      expect(rows.length).toEqual(1);

      service.loadMore(10);

      const op = controller.expectOne(addTypenameToDocument(BEST_BOOKS_QUERY));
      expect(op.operation.variables.skip).toEqual(10);

      op.flush({
        data: {
          bestBooks: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'BestBooks',
          },
        },
      });

      tick();
      expect(rows.length).toEqual(2);
    }));
  });

  describe('rateBook()', () => {
    it('should return previous cache if book with passed id is not there', fakeAsync(() => {
      let rows: Book[];

      service.watchBooks().subscribe(({ data }) => {
        rows = data.bestBooks.rows;
      });

      controller.expectOne(addTypenameToDocument(BEST_BOOKS_QUERY)).flush({
        data: {
          bestBooks: {
            rows: [{ ...bookWithTypename, _id: '1213' }],
            count: 1,
            __typename: 'BestBooks',
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

    it('should remove book if rating is less than 5', fakeAsync(() => {
      let rows: Book[];

      service.watchBooks().subscribe(({ data }) => {
        rows = data.bestBooks.rows;
      });

      controller.expectOne(addTypenameToDocument(BEST_BOOKS_QUERY)).flush({
        data: {
          bestBooks: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'BestBooks',
          },
        },
      });

      tick();

      service.rateBook({ bookId: book._id, rate: 3 }).subscribe();

      controller.expectOne(addTypenameToDocument(RATE_BOOK_MUTATION)).flush({
        data: {
          rateBook: {
            total_rating: book.total_rating + 1,
            total_rates: book.total_rates + 1,
            rating: 3,
          },
        },
      });

      tick();

      expect(rows.length).toEqual(0);
    }));

    it('should update book in cache if rating is still 5', fakeAsync(() => {
      let rows: Book[];

      service.watchBooks().subscribe(({ data }) => {
        rows = data.bestBooks.rows;
      });

      controller.expectOne(addTypenameToDocument(BEST_BOOKS_QUERY)).flush({
        data: {
          bestBooks: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'BestBooks',
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
