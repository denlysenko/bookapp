// tslint:disable: no-big-function
// tslint:disable: no-duplicate-string
import { AuthModule } from '@bookapp/api/auth';
import { BooksModule, BooksService, BOOK_VALIDATION_ERRORS } from '@bookapp/api/books';
import { GraphqlModule } from '@bookapp/api/graphql';
import { ModelNames } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import { ROLES } from '@bookapp/shared/enums';
import {
  book,
  MockBooksService,
  MockConfigService,
  mockConnection,
  MockModel,
  user,
} from '@bookapp/testing';

import { HttpStatus, INestApplication, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import * as jwt from 'jsonwebtoken';
import { ValidationError } from 'mongoose/lib/error';
import * as request from 'supertest';

const authToken = jwt.sign({ id: user._id }, 'ACCESS_TOKEN_SECRET');

const validationError = new ValidationError();
validationError.errors = {
  title: {
    message: BOOK_VALIDATION_ERRORS.TITLE_REQUIRED_ERR,
  },
  author: {
    message: BOOK_VALIDATION_ERRORS.AUTHOR_REQUIRED_ERR,
  },
};

describe('BooksModule', () => {
  let app: INestApplication;
  let booksService: BooksService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule,
        GraphqlModule,
        BooksModule,
        MongooseModule.forRoot('test'),
      ],
    })
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .overrideProvider(getModelToken(ModelNames.BOOK))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.LOG))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.COMMENT))
      .useValue(MockModel)
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(BooksService)
      .useValue(MockBooksService)
      .compile();

    booksService = module.get<BooksService>(BooksService);
    usersService = module.get<UsersService>(UsersService);

    jest.spyOn(usersService, 'findById').mockResolvedValue({
      ...user,
      roles: [ROLES.ADMIN],
    } as any);

    app = module.createNestApplication();
    await app.init();
  });

  describe('getBooks()', () => {
    it('should get books', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            books(paid: false) {
              rows {
                _id
              }
            }
          }`,
        })
        .expect({
          data: {
            books: {
              rows: [
                {
                  _id: book._id,
                },
              ],
            },
          },
        });
    });

    it('should filter books', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            books(paid: false, filter: { field: "test", search: "query" }) {
              rows {
                _id
              }
            }
          }`,
        });

      expect(booksService.findAll).toHaveBeenCalledWith({
        filter: { paid: false, test: /query/i },
        first: null,
        order: null,
        skip: null,
      });
    });

    it('should skip books', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            books(paid: false, skip: 10) {
              rows {
                _id
              }
            }
          }`,
        });

      expect(booksService.findAll).toHaveBeenCalledWith({
        filter: { paid: false },
        first: null,
        order: null,
        skip: 10,
      });
    });

    it('should limit books', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            books(paid: false, first: 10) {
              rows {
                _id
              }
            }
          }`,
        });

      expect(booksService.findAll).toHaveBeenCalledWith({
        filter: { paid: false },
        first: 10,
        order: null,
        skip: null,
      });
    });

    it('should order books', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            books(paid: false, orderBy: title_asc) {
              rows {
                _id
              }
            }
          }`,
        });

      expect(booksService.findAll).toHaveBeenCalledWith({
        filter: { paid: false },
        first: null,
        order: { title: 1 },
        skip: null,
      });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer()).post('/graphql').send({
        query: `query {
            books(paid: false) {
              rows {
                _id
              }
            }
          }`,
      });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });
  });

  describe('getBestBooks()', () => {
    it('should get books with rating of 5', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            bestBooks {
              rows {
                _id
              }
            }
          }`,
        })
        .expect({
          data: {
            bestBooks: {
              rows: [
                {
                  _id: book._id,
                },
              ],
            },
          },
        });
    });

    it('should skip best books', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            bestBooks(skip: 10) {
              rows {
                _id
              }
            }
          }`,
        });

      expect(booksService.findBestBooks).toHaveBeenCalledWith({
        filter: null,
        first: null,
        order: null,
        skip: 10,
      });
    });

    it('should limit best books', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            bestBooks(first: 10) {
              rows {
                _id
              }
            }
          }`,
        });

      expect(booksService.findBestBooks).toHaveBeenCalledWith({
        filter: null,
        first: 10,
        order: null,
        skip: null,
      });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer()).post('/graphql').send({
        query: `query {
            bestBooks {
              rows {
                _id
              }
            }
          }`,
      });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });
  });

  describe('getBook()', () => {
    it('should get book by slug', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            book(slug: "book-title") {
              _id
            }
          }`,
        })
        .expect({
          data: {
            book: {
              _id: book._id,
            },
          },
        });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer()).post('/graphql').send({
        query: `query {
            book(slug: "book-title") {
              _id
            }
          }`,
      });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });
  });

  describe('createBook()', () => {
    it('should create book', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            createBook(book: {
              title: "Test Book",
              author: "Test Author",
              description: "Book description",
              coverUrl: "uploads/cover.png",
              epubUrl: "uploads/book.epub",
              paid: false
            }) {
              _id
            }
          }`,
        })
        .expect({
          data: {
            createBook: {
              _id: book._id,
            },
          },
        });

      expect(booksService.create).toHaveBeenCalledWith(
        {
          title: 'Test Book',
          author: 'Test Author',
          description: 'Book description',
          coverUrl: 'uploads/cover.png',
          epubUrl: 'uploads/book.epub',
          paid: false,
        },
        user._id
      );
    });

    it('should not create book if there are errors', async () => {
      jest
        .spyOn(booksService, 'create')
        .mockImplementationOnce(() => Promise.reject(validationError));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            createBook(book: {
              title: "Test Book",
              author: "Test Author",
              description: "Book description",
              coverUrl: "uploads/cover.png",
              epubUrl: "uploads/book.epub",
              paid: false
            }) {
              _id
            }
          }`,
        });

      const [error] = res.body.errors;

      expect(error).toEqual({
        title: { message: BOOK_VALIDATION_ERRORS.TITLE_REQUIRED_ERR },
        author: { message: BOOK_VALIDATION_ERRORS.AUTHOR_REQUIRED_ERR },
      });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer()).post('/graphql').send({
        query: `mutation {
            createBook(book: {
              title: "Test Book",
              author: "Test Author",
              description: "Book description",
              coverUrl: "uploads/cover.png",
              epubUrl: "uploads/book.epub",
              paid: false
            }) {
              _id
            }
          }`,
      });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });

    it('should return FORBIDDEN error', async () => {
      jest
        .spyOn(usersService, 'findById')
        .mockImplementationOnce(() => Promise.resolve({ ...user } as any));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            createBook(book: {
              title: "Test Book",
              author: "Test Author",
              description: "Book description",
              coverUrl: "uploads/cover.png",
              epubUrl: "uploads/book.epub",
              paid: false
            }) {
              _id
            }
          }`,
        });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: HttpStatus.FORBIDDEN,
      });
    });
  });

  describe('updateBook()', () => {
    it('should update book', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            updateBook(id: "book_id", book: {
              coverUrl: "uploads/cover2.png",
              epubUrl: "uploads/book2.epub"
            }) {
              _id
            }
          }`,
        })
        .expect({
          data: {
            updateBook: {
              _id: book._id,
            },
          },
        });

      expect(booksService.update).toHaveBeenCalledWith(
        'book_id',
        {
          coverUrl: 'uploads/cover2.png',
          epubUrl: 'uploads/book2.epub',
        },
        user._id
      );
    });

    it('should not create book if there are errors', async () => {
      jest
        .spyOn(booksService, 'update')
        .mockImplementationOnce(() => Promise.reject(validationError));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            updateBook(id: "book_id", book: {
              coverUrl: "uploads/cover2.png",
              epubUrl: "uploads/book2.epub"
            }) {
              _id
            }
          }`,
        });

      const [error] = res.body.errors;

      expect(error).toEqual({
        title: { message: BOOK_VALIDATION_ERRORS.TITLE_REQUIRED_ERR },
        author: { message: BOOK_VALIDATION_ERRORS.AUTHOR_REQUIRED_ERR },
      });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer()).post('/graphql').send({
        query: `mutation {
            updateBook(id: "book_id", book: {
              coverUrl: "uploads/cover2.png",
              epubUrl: "uploads/book2.epub"
            }) {
              _id
            }
          }`,
      });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });

    it('should return FORBIDDEN error', async () => {
      jest
        .spyOn(usersService, 'findById')
        .mockImplementationOnce(() => Promise.resolve({ ...user } as any));

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            updateBook(id: "book_id", book: {
              coverUrl: "uploads/cover2.png",
              epubUrl: "uploads/book2.epub"
            }) {
              _id
            }
          }`,
        });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: HttpStatus.FORBIDDEN,
      });
    });
  });

  describe('rateBook()', () => {
    it('should rate book', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            rateBook(id: "book_id", rate: 5) {
              _id
            }
          }`,
        })
        .expect({
          data: {
            rateBook: {
              _id: book._id,
            },
          },
        });
    });

    it('should not rate book if there are errors', async () => {
      jest
        .spyOn(booksService, 'rateBook')
        .mockImplementationOnce(() =>
          Promise.reject(new NotFoundException(BOOK_VALIDATION_ERRORS.BOOK_NOT_FOUND_ERR))
        );

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            rateBook(id: "book_id", rate: 5) {
              _id
            }
          }`,
        });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        error: 'Not Found',
        message: BOOK_VALIDATION_ERRORS.BOOK_NOT_FOUND_ERR,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer()).post('/graphql').send({
        query: `mutation {
            rateBook(id: "book_id", rate: 5) {
              _id
            }
          }`,
      });

      const [error] = res.body.errors;

      expect(error.extensions.exception.response).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
