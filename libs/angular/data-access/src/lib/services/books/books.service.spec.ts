// tslint:disable: no-identical-functions
// tslint:disable: no-big-function
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { Book, BOOKMARKS } from '@bookapp/shared/models';
import {
  ADD_COMMENT_MUTATION,
  ADD_TO_BOOKMARKS_MUTATION,
  BOOK_QUERY,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  CREATE_BOOK_MUTATION,
  FREE_BOOKS_QUERY,
  PAID_BOOKS_QUERY,
  REMOVE_FROM_BOOKMARKS_MUTATION,
  UPDATE_BOOK_MUTATION
} from '@bookapp/shared/queries';
import { book, bookmark, user } from '@bookapp/testing';

import { Apollo } from 'apollo-angular';
import {
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { addTypenameToDocument } from 'apollo-utilities';

import { BooksService, DEFAULT_SORT_VALUE } from './books.service';

const bookWithTypename = { ...book, __typename: 'Book' };
const bookmarkWithTypename = { type: bookmark.type, __typename: 'Bookmark' };

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
          useValue: new InMemoryCache({ addTypename: true })
        }
      ]
    });

    controller = TestBed.get(ApolloTestingController);
    service = TestBed.get(BooksService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create()', () => {
    // tslint:disable: no-shadowed-variable
    let controller: ApolloTestingController;
    let service: BooksService;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ApolloTestingModule],
        providers: [BooksService]
      });

      controller = TestBed.get(ApolloTestingController);
      service = TestBed.get(BooksService);
    });

    const newBook = {
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      epubUrl: book.epubUrl,
      description: book.description,
      paid: book.paid
    };

    it('should create book', done => {
      service.create(newBook).subscribe(({ data: { createBook } }) => {
        expect(createBook).toEqual(bookWithTypename);
        done();
      });

      const op = controller.expectOne(CREATE_BOOK_MUTATION);

      expect(op.operation.variables.book).toEqual(newBook);

      op.flush({
        data: {
          createBook: bookWithTypename
        }
      });

      controller.verify();
    });
  });

  describe('update()', () => {
    // tslint:disable: no-shadowed-variable
    let controller: ApolloTestingController;
    let service: BooksService;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ApolloTestingModule],
        providers: [BooksService]
      });

      controller = TestBed.get(ApolloTestingController);
      service = TestBed.get(BooksService);
    });

    it('should update book', done => {
      const updatedBook = {
        coverUrl: 'uploads/new_cover.png'
      };

      service
        .update(book._id, updatedBook)
        .subscribe(({ data: { updateBook } }) => {
          expect(updateBook).toEqual(bookWithTypename);
          done();
        });

      const op = controller.expectOne(UPDATE_BOOK_MUTATION);

      expect(op.operation.variables.id).toEqual(book._id);
      expect(op.operation.variables.book).toEqual(updatedBook);

      op.flush({
        data: {
          updateBook: bookWithTypename
        }
      });

      controller.verify();
    });
  });

  describe('getBooks()', () => {
    it('should get paid books', done => {
      service
        .getBooks(true)
        .valueChanges.subscribe(({ data: { books: { rows } } }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        });

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
          __typename: 'Book'
        }
      };

      op.flush({
        data
      });

      controller.verify();
    });

    it('should get free books', done => {
      service
        .getBooks(false)
        .valueChanges.subscribe(({ data: { books: { rows } } }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        });

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
            __typename: 'Book'
          }
        }
      });

      controller.verify();
    });

    it('should filter books', done => {
      service
        .getBooks(false, { field: 'field', search: 'search' })
        .valueChanges.subscribe(({ data: { books: { rows } } }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        });

      const op = controller.expectOne(addTypenameToDocument(FREE_BOOKS_QUERY));

      expect(op.operation.variables.paid).toEqual(false);
      expect(op.operation.variables.filter).toEqual({
        field: 'field',
        search: 'search'
      });
      expect(op.operation.variables.skip).toEqual(0);
      expect(op.operation.variables.first).toEqual(DEFAULT_LIMIT);
      expect(op.operation.variables.orderBy).toEqual(DEFAULT_SORT_VALUE);

      op.flush({
        data: {
          books: {
            rows: [bookWithTypename],
            count: 1,
            __typename: 'Book'
          }
        }
      });

      controller.verify();
    });

    it('should skip books', done => {
      service
        .getBooks(false, undefined, undefined, 10)
        .valueChanges.subscribe(({ data: { books: { rows } } }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        });

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
            __typename: 'Book'
          }
        }
      });

      controller.verify();
    });

    it('should limit books', done => {
      service
        .getBooks(false, undefined, undefined, undefined, 20)
        .valueChanges.subscribe(({ data: { books: { rows } } }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        });

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
            __typename: 'Book'
          }
        }
      });

      controller.verify();
    });

    it('should order books', done => {
      service
        .getBooks(false, undefined, 'title_desc')
        .valueChanges.subscribe(({ data: { books: { rows } } }) => {
          const [b] = rows;
          expect(b._id).toEqual(book._id);
          done();
        });

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
            __typename: 'Book'
          }
        }
      });

      controller.verify();
    });
  });

  describe('getBook()', () => {
    it('should get book', done => {
      service.getBook(book.slug).valueChanges.subscribe(({ data }) => {
        expect(data.book._id).toEqual(book._id);
        done();
      });

      const op = controller.expectOne(addTypenameToDocument(BOOK_QUERY));

      expect(op.operation.variables.slug).toEqual(book.slug);

      op.flush({
        data: {
          book: { ...bookWithTypename, comments: [] }
        }
      });

      controller.verify();
    });
  });

  describe('addComment()', () => {
    const comment = {
      _id: 'comment_2',
      bookId: book._id,
      author: { ...user, __typename: 'User' },
      text: 'New comment',
      createdAt: 1563132857195,
      __typename: 'Comment'
    };

    beforeEach(() => {
      service.getBook(book.slug).valueChanges.subscribe();
      controller.expectOne(addTypenameToDocument(BOOK_QUERY)).flush({
        data: {
          book: { ...bookWithTypename, comments: [] }
        }
      });
    });

    it('should call ADD_COMMENT_MUTATION', done => {
      service
        .addComment(book._id, comment.text, book.slug)
        .subscribe(({ data: { addComment } }) => {
          expect(addComment.text).toEqual(comment.text);
          done();
        });

      const op = controller.expectOne(
        addTypenameToDocument(ADD_COMMENT_MUTATION)
      );

      expect(op.operation.variables.bookId).toEqual(book._id);
      expect(op.operation.variables.text).toEqual(comment.text);

      op.flush({
        data: {
          addComment: comment
        }
      });

      controller.verify();
    });

    it('should update book in store with new comment', done => {
      const apollo: Apollo = TestBed.get(Apollo);

      service.addComment(book._id, comment.text, book.slug).subscribe(() => {
        apollo
          .query<{ book: Book }>({
            query: BOOK_QUERY,
            variables: {
              slug: book.slug
            }
          })
          .subscribe(({ data: { book } }) => {
            expect(book.comments.length).toEqual(1);
            expect(book.comments[0].text).toEqual(comment.text);
            done();
          });
      });

      controller.expectOne(addTypenameToDocument(ADD_COMMENT_MUTATION)).flush({
        data: {
          addComment: comment
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
