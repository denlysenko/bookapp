// tslint:disable: no-big-function
import { ConfigService } from '@bookapp/api/config';
import { LogsService } from '@bookapp/api/logs';
import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import { BOOKMARKS, UserActions } from '@bookapp/shared';
import {
  MockConfigService,
  MockLogsService,
  MockModel,
  MockMongooseModel,
  user
} from '@bookapp/testing';

import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { BookmarksService } from './bookmarks.service';
import { BOOKMARK_ERRORS } from './constants';

const bookId = 'book_id';

describe('BookmarksService', () => {
  let bookmarksService: BookmarksService;
  let configService: ConfigService;
  let bookmarkModel: any;
  let logsService: LogsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookmarksService,
        {
          provide: ConfigService,
          useValue: MockConfigService
        },
        {
          provide: getModelToken(ModelNames.BOOKMARK),
          useValue: MockModel
        },
        {
          provide: LogsService,
          useValue: MockLogsService
        }
      ]
    }).compile();

    bookmarksService = module.get<BookmarksService>(BookmarksService);
    configService = module.get<ConfigService>(ConfigService);
    bookmarkModel = module.get(getModelToken(ModelNames.BOOKMARK));
    logsService = module.get<LogsService>(LogsService);

    jest.spyOn(bookmarkModel, 'exec').mockImplementation(() => Promise.resolve(MockMongooseModel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByType()', () => {
    beforeEach(() => {
      jest.spyOn(bookmarkModel, 'exec').mockImplementation(() => Promise.resolve(1));
    });

    it('should count bookmarks by type for particular user', async () => {
      await bookmarksService.getByType(new ApiQuery());
      expect(bookmarkModel.countDocuments).toHaveBeenCalled();
    });

    it('should get bookmarks by type for particular user', async () => {
      await bookmarksService.getByType(
        new ApiQuery({ type: BOOKMARKS.FAVORITES, userId: user._id })
      );
      expect(bookmarkModel.find).toHaveBeenCalledWith({
        type: BOOKMARKS.FAVORITES,
        userId: user._id
      });
    });

    it('should skip bookmarks with default value by type for particular user', async () => {
      await bookmarksService.getByType(
        new ApiQuery({ type: BOOKMARKS.FAVORITES, userId: user._id })
      );
      expect(bookmarkModel.skip).toHaveBeenCalledWith(0);
    });

    it('should skip bookmarks with value from query by type for particular user', async () => {
      await bookmarksService.getByType(
        new ApiQuery({ type: BOOKMARKS.FAVORITES, userId: user._id }, null, 10)
      );
      expect(bookmarkModel.skip).toHaveBeenCalledWith(10);
    });

    it('should limit bookmarks with default value by type for particular user', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('5');
      await bookmarksService.getByType(
        new ApiQuery({ type: BOOKMARKS.FAVORITES, userId: user._id })
      );
      expect(bookmarkModel.limit).toHaveBeenCalledWith(5);
    });

    it('should limit bookmarks with value from query by type for particular user', async () => {
      await bookmarksService.getByType(
        new ApiQuery({ type: BOOKMARKS.FAVORITES, userId: user._id }, 10)
      );
      expect(bookmarkModel.limit).toHaveBeenCalledWith(10);
    });
  });

  describe('getByUserAndBook()', () => {
    it('should get bookmarks by user and book', async () => {
      await bookmarksService.getByUserAndBook(user._id, bookId);
      expect(bookmarkModel.find).toHaveBeenCalledWith({
        userId: user._id,
        bookId
      });
    });
  });

  describe('addToBookmarks()', () => {
    it('should try to find bookmark', async () => {
      jest.spyOn(bookmarkModel, 'exec').mockImplementationOnce(() => Promise.resolve(null));

      await bookmarksService.addToBookmarks(BOOKMARKS.FAVORITES, user._id, bookId);
      expect(bookmarkModel.findOne).toHaveBeenCalledWith({
        type: BOOKMARKS.FAVORITES,
        bookId,
        userId: user._id
      });
    });

    it('should throw error if bookmark was found', async () => {
      try {
        await bookmarksService.addToBookmarks(BOOKMARKS.FAVORITES, user._id, bookId);
      } catch (err) {
        expect(err.message).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: BOOKMARK_ERRORS.BOOKMARK_UNIQUE_ERR
        });
      }
    });

    it('should save if bookmark was not found', async () => {
      jest.spyOn(bookmarkModel, 'exec').mockImplementationOnce(() => Promise.resolve(null));

      await bookmarksService.addToBookmarks(BOOKMARKS.FAVORITES, user._id, bookId);
      expect(bookmarkModel.save).toHaveBeenCalled();
    });

    it('should create Log', async () => {
      jest.spyOn(bookmarkModel, 'exec').mockImplementationOnce(() => Promise.resolve(null));

      await bookmarksService.addToBookmarks(BOOKMARKS.FAVORITES, user._id, bookId);
      expect(logsService.create).toHaveBeenCalledWith({
        action: UserActions.BOOK_ADDED_TO_FAVORITES,
        bookId,
        userId: user._id
      });
    });
  });

  describe('removeFromBookmarks()', () => {
    it('should try to find bookmark', async () => {
      await bookmarksService.removeFromBookmarks(BOOKMARKS.FAVORITES, user._id, bookId);
      expect(bookmarkModel.findOne).toHaveBeenCalledWith({
        type: BOOKMARKS.FAVORITES,
        bookId,
        userId: user._id
      });
    });

    it('should throw error if bookmark was not found', async () => {
      jest.spyOn(bookmarkModel, 'exec').mockImplementationOnce(() => Promise.resolve(null));

      try {
        await bookmarksService.removeFromBookmarks(BOOKMARKS.FAVORITES, user._id, bookId);
      } catch (err) {
        expect(err.message).toEqual({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: BOOKMARK_ERRORS.BOOKMARK_NOT_FOUND_ERR
        });
      }
    });

    it('should remove if bookmark was found', async () => {
      await bookmarksService.removeFromBookmarks(BOOKMARKS.FAVORITES, user._id, bookId);
      expect(bookmarkModel.remove).toHaveBeenCalled();
    });

    it('should create Log', async () => {
      await bookmarksService.removeFromBookmarks(BOOKMARKS.FAVORITES, user._id, bookId);
      expect(logsService.create).toHaveBeenCalledWith({
        action: UserActions.BOOK_REMOVED_FROM_FAVORITES,
        bookId,
        userId: user._id
      });
    });
  });
});
