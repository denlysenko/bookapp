import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { InMemoryCache } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';

import { Book } from '@bookapp/shared/interfaces';
import { ADD_COMMENT_MUTATION, BOOK_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';
import { book, user } from '@bookapp/testing/angular';

import {
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';

import { BookService } from './book.service';

const bookWithTypename = { ...book, __typename: 'Book' };

describe('BookService', () => {
  let controller: ApolloTestingController;
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        BookService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({ addTypename: true }),
        },
      ],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('watchBook()', () => {
    it('should watch book', (done) => {
      service.watchBook(book.slug).subscribe(({ data }) => {
        expect(data.book.id).toEqual(book.id);
        done();
      });

      const op = controller.expectOne(addTypenameToDocument(BOOK_QUERY));

      expect(op.operation.variables.slug).toEqual(book.slug);

      op.flush({
        data: {
          book: { ...bookWithTypename, comments: [] },
        },
      });

      controller.verify();
    });
  });

  describe('fetchBook()', () => {
    it('should fetch book', (done) => {
      service.fetchBook(book.slug).subscribe(({ data }) => {
        expect(data.book.id).toEqual(book.id);
        done();
      });

      const op = controller.expectOne(addTypenameToDocument(BOOK_QUERY));

      expect(op.operation.variables.slug).toEqual(book.slug);

      op.flush({
        data: {
          book: { ...bookWithTypename, comments: [] },
        },
      });

      controller.verify();
    });
  });

  describe('rateBook()', () => {
    it('should update book in cache', fakeAsync(() => {
      let foundBook: Book;

      service.watchBook(book.slug).subscribe(({ data }) => {
        foundBook = data.book;
      });

      controller.expectOne(addTypenameToDocument(BOOK_QUERY)).flush({
        data: {
          book: { ...bookWithTypename, comments: [] },
        },
      });

      tick();

      service.rateBook({ bookId: book.id, rate: 5 }).subscribe();

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

      expect(foundBook.rating).toEqual(5);
      expect(foundBook.total_rating).toEqual(book.total_rating + 1);
      expect(foundBook.total_rates).toEqual(book.total_rates + 1);
    }));
  });

  describe('addComment()', () => {
    const comment = {
      author: { displayName: user.displayName, __typename: 'User' },
      text: 'New comment',
      createdAt: 1563132857195,
      __typename: 'Comment',
    };

    it('should add comment and update book in cache', fakeAsync(() => {
      let foundBook: Book;

      service.watchBook(book.slug).subscribe(({ data }) => {
        foundBook = data.book;
      });

      controller.expectOne(addTypenameToDocument(BOOK_QUERY)).flush({
        data: {
          book: { ...bookWithTypename, comments: [] },
        },
      });

      tick();

      expect(foundBook.comments.length).toEqual(0);

      service.addComment(book.id, comment.text).subscribe();

      controller.expectOne(addTypenameToDocument(ADD_COMMENT_MUTATION)).flush({
        data: {
          addComment: comment,
        },
      });

      tick();

      expect(foundBook.comments.length).toEqual(1);
      expect(foundBook.comments[0]).toEqual(comment);
    }));
  });
});
