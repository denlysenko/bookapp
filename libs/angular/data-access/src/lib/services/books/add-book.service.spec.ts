import { TestBed } from '@angular/core/testing';

import { CREATE_BOOK_MUTATION, UPDATE_BOOK_MUTATION } from '@bookapp/shared/queries';
import { book } from '@bookapp/testing';

import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { AddBookService } from './add-book.service';

const bookWithTypename = { ...book, __typename: 'Book' };

describe('AddBookService', () => {
  let controller: ApolloTestingController;
  let service: AddBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [AddBookService],
    });

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(AddBookService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create()', () => {
    const newBook = {
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      epubUrl: book.epubUrl,
      description: book.description,
      paid: book.paid,
    };

    it('should create book', (done) => {
      service.create(newBook).subscribe(({ data: { createBook } }) => {
        expect(createBook).toEqual(bookWithTypename);
        done();
      });

      const op = controller.expectOne(CREATE_BOOK_MUTATION);

      expect(op.operation.variables.book).toEqual(newBook);

      op.flush({
        data: {
          createBook: bookWithTypename,
        },
      });

      controller.verify();
    });
  });

  describe('update()', () => {
    it('should update book', (done) => {
      const updatedBook = {
        coverUrl: 'uploads/new_cover.png',
      };

      service.update(book._id, updatedBook).subscribe(({ data: { updateBook } }) => {
        expect(updateBook).toEqual(bookWithTypename);
        done();
      });

      const op = controller.expectOne(UPDATE_BOOK_MUTATION);

      expect(op.operation.variables.id).toEqual(book._id);
      expect(op.operation.variables.book).toEqual(updatedBook);

      op.flush({
        data: {
          updateBook: bookWithTypename,
        },
      });

      controller.verify();
    });
  });
});
