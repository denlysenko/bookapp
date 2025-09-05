/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthModule } from '@bookapp/api/auth';
import { BOOK_VALIDATION_ERRORS, BooksModule, BooksService } from '@bookapp/api/books';
import { GraphqlModule } from '@bookapp/api/graphql';
import { ModelNames, MongooseValidationFilter } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import { ROLES } from '@bookapp/shared/enums';
import {
  book,
  MockBooksService,
  MockConfigService,
  mockConnection,
  MockModel,
  user,
} from '@bookapp/testing/api';

import { INestApplication, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import jwt from 'jsonwebtoken';
import { ValidationError } from 'mongoose/lib/error';
import request from 'supertest';

const authToken = jwt.sign({ id: user.id }, 'ACCESS_TOKEN_SECRET');

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
      .overrideProvider(getModelToken(ModelNames.AUTH_TOKEN))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.BOOK))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.LOG))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.COMMENT))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.PASSKEY))
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
    app.useGlobalFilters(new MongooseValidationFilter());
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
                id
              }
            }
          }`,
        })
        .expect({
          data: {
            books: {
              rows: [
                {
                  id: book.id,
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
                id
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
                id
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
                id
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
                id
              }
            }
          }`,
        });

      expect(booksService.findAll).toHaveBeenCalledWith({
        filter: { paid: false },
        first: null,
        order: { title: 'asc' },
        skip: null,
      });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            books(paid: false) {
              rows {
                id
              }
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
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
                id
              }
            }
          }`,
        })
        .expect({
          data: {
            bestBooks: {
              rows: [
                {
                  id: book.id,
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
                id
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
                id
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

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            bestBooks {
              rows {
                  id
              }
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
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
              id
            }
          }`,
        })
        .expect({
          data: {
            book: {
              id: book.id,
            },
          },
        });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            book(slug: "book-title") {
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
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
              id
            }
          }`,
        })
        .expect({
          data: {
            createBook: {
              id: book.id,
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
        user.id
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
              id
            }
          }`,
        });

      const [error] = res.body.errors;

      expect(error.extensions.errors).toEqual({
        title: { message: BOOK_VALIDATION_ERRORS.TITLE_REQUIRED_ERR },
        author: { message: BOOK_VALIDATION_ERRORS.AUTHOR_REQUIRED_ERR },
      });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
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
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
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
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('FORBIDDEN');
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
              id
            }
          }`,
        })
        .expect({
          data: {
            updateBook: {
              id: book.id,
            },
          },
        });

      expect(booksService.update).toHaveBeenCalledWith(
        'book_id',
        {
          coverUrl: 'uploads/cover2.png',
          epubUrl: 'uploads/book2.epub',
        },
        user.id
      );
    });

    it('should not update book if there are errors', async () => {
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
              id
            }
          }`,
        });

      const [error] = res.body.errors;

      expect(error.extensions.errors).toEqual({
        title: { message: BOOK_VALIDATION_ERRORS.TITLE_REQUIRED_ERR },
        author: { message: BOOK_VALIDATION_ERRORS.AUTHOR_REQUIRED_ERR },
      });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            updateBook(id: "book_id", book: {
              coverUrl: "uploads/cover2.png",
              epubUrl: "uploads/book2.epub"
            }) {
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
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
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('FORBIDDEN');
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
              id
            }
          }`,
        })
        .expect({
          data: {
            rateBook: {
              id: book.id,
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
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.message).toEqual(BOOK_VALIDATION_ERRORS.BOOK_NOT_FOUND_ERR);
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            rateBook(id: "book_id", rate: 5) {
              id
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
