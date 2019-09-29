// tslint:disable: no-big-function
// tslint:disable: no-duplicate-string
import { AuthModule } from '@bookapp/api/auth';
import {
  BOOKMARK_ERRORS,
  BookmarksModule,
  BookmarksService
} from '@bookapp/api/bookmarks';
import { ConfigModule, ConfigService } from '@bookapp/api/config';
import { GraphqlModule } from '@bookapp/api/graphql';
import { ModelNames } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import { BOOKMARKS } from '@bookapp/shared';
import {
  bookmark,
  MockConfigService,
  mockConnection,
  MockModel,
  user
} from '@bookapp/testing';

import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  NotFoundException
} from '@nestjs/common';
import {
  getConnectionToken,
  getModelToken,
  MongooseModule
} from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';

const authToken = jwt.sign({ id: user._id }, 'ACCESS_TOKEN_SECRET');

const MockBookmarksService = {
  getByType: jest.fn().mockResolvedValue({ count: 1, rows: [bookmark] }),
  getByUserAndBook: jest.fn().mockResolvedValue([bookmark]),
  addToBookmarks: jest.fn().mockResolvedValue(bookmark),
  removeFromBookmarks: jest.fn().mockResolvedValue(bookmark)
};

describe('BookmarksModule', () => {
  let app: INestApplication;
  let bookmarksService: BookmarksService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        AuthModule,
        GraphqlModule,
        BookmarksModule,
        MongooseModule.forRoot('test')
      ]
    })
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(getModelToken(ModelNames.BOOKMARK))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.LOG))
      .useValue(MockModel)
      .overrideProvider(BookmarksService)
      .useValue(MockBookmarksService)
      .compile();

    bookmarksService = module.get<BookmarksService>(BookmarksService);
    usersService = module.get<UsersService>(UsersService);

    jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);

    app = module.createNestApplication();
    await app.init();
  });

  describe('getBookmarks()', () => {
    it('should get bookmarks', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            bookmarks(type: WISHLIST) {
              rows {
                type
              }
            }
          }`
        })
        .expect({
          data: {
            bookmarks: {
              rows: [
                {
                  type: bookmark.type
                }
              ]
            }
          }
        });
    });

    it('should skip bookmarks', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            bookmarks(type: WISHLIST, skip: 10) {
              rows {
                type
              }
            }
          }`
        });

      expect(bookmarksService.getByType).toHaveBeenCalledWith({
        filter: { userId: user._id, type: BOOKMARKS.WISHLIST },
        first: null,
        order: null,
        skip: 10
      });
    });

    it('should limit bookmarks', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            bookmarks(type: WISHLIST, first: 10) {
              rows {
                type
              }
            }
          }`
        });

      expect(bookmarksService.getByType).toHaveBeenCalledWith({
        filter: { userId: user._id, type: BOOKMARKS.WISHLIST },
        first: 10,
        order: null,
        skip: null
      });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            bookmarks(type: WISHLIST) {
              rows {
                type
              }
            }
          }`
        });

      const [error] = res.body.errors;

      expect(error.message).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized'
      });
    });
  });

  describe('getUserBookmarksByBook()', () => {
    it('should get user bookmarks by book', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            userBookmarksByBook(bookId: "book_id") {
              type
            }
          }`
        })
        .expect({
          data: {
            userBookmarksByBook: [
              {
                type: bookmark.type
              }
            ]
          }
        });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            userBookmarksByBook(bookId: "book_id") {
              type
            }
          }`
        });

      const [error] = res.body.errors;

      expect(error.message).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized'
      });
    });
  });

  describe('addToBookmarks()', () => {
    it('should add to bookmarks', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            addToBookmarks(type: WISHLIST, bookId: "book_id") {
              type
            }
          }`
        })
        .expect({
          data: {
            addToBookmarks: {
              type: bookmark.type
            }
          }
        });
    });

    it('should throw error if bookmark is duplicated', async () => {
      jest
        .spyOn(bookmarksService, 'addToBookmarks')
        .mockImplementationOnce(() =>
          Promise.reject(
            new BadRequestException(BOOKMARK_ERRORS.BOOKMARK_UNIQUE_ERR)
          )
        );

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            addToBookmarks(type: WISHLIST, bookId: "book_id") {
              type
            }
          }`
        });

      const [error] = res.body.errors;

      expect(error.message).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: BOOKMARK_ERRORS.BOOKMARK_UNIQUE_ERR
      });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            addToBookmarks(type: WISHLIST, bookId: "book_id") {
              type
            }
          }`
        });

      const [error] = res.body.errors;

      expect(error.message).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized'
      });
    });
  });

  describe('removeFromBookmarks()', () => {
    it('should remove from bookmarks', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            removeFromBookmarks(type: WISHLIST, bookId: "book_id") {
              type
            }
          }`
        })
        .expect({
          data: {
            removeFromBookmarks: {
              type: bookmark.type
            }
          }
        });
    });

    it('should throw error if bookmark was not found', async () => {
      jest
        .spyOn(bookmarksService, 'removeFromBookmarks')
        .mockImplementationOnce(() =>
          Promise.reject(
            new NotFoundException(BOOKMARK_ERRORS.BOOKMARK_NOT_FOUND_ERR)
          )
        );

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            removeFromBookmarks(type: WISHLIST, bookId: "book_id") {
              type
            }
          }`
        });

      const [error] = res.body.errors;

      expect(error.message).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: BOOKMARK_ERRORS.BOOKMARK_NOT_FOUND_ERR
      });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            removeFromBookmarks(type: WISHLIST, bookId: "book_id") {
              type
            }
          }`
        });

      const [error] = res.body.errors;

      expect(error.message).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized'
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
