// tslint:disable: no-identical-functions
// tslint:disable: no-big-function
// tslint:disable: no-duplicate-string
import { ConfigService } from '@bookapp/api/config';
import { FilesService } from '@bookapp/api/files';
import { PUB_SUB } from '@bookapp/api/graphql';
import { LogsService } from '@bookapp/api/logs';
import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import {
  book,
  MockConfigService,
  MockLogsService,
  MockModel,
  MockMongooseModel
} from '@bookapp/testing';

import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { PubSub } from 'graphql-subscriptions';

import { BooksService } from './books.service';
import { BOOK_VALIDATION_ERRORS } from './constants';

const userId = 'user_id';

describe('BooksService', () => {
  let booksService: BooksService;
  let configService: ConfigService;
  let bookModel: any;
  let logsService: LogsService;
  let filesService: FilesService;
  let pubSub: PubSub;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: ConfigService,
          useValue: MockConfigService
        },
        {
          provide: getModelToken(ModelNames.BOOK),
          useValue: MockModel
        },
        {
          provide: LogsService,
          useValue: MockLogsService
        },
        {
          provide: FilesService,
          useValue: {
            deleteFromBucket: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: PUB_SUB,
          useValue: {
            publish: jest.fn()
          }
        }
      ]
    }).compile();

    booksService = module.get<BooksService>(BooksService);
    configService = module.get<ConfigService>(ConfigService);
    bookModel = module.get(getModelToken(ModelNames.BOOK));
    logsService = module.get<LogsService>(LogsService);
    filesService = module.get<FilesService>(FilesService);
    pubSub = module.get<PubSub>(PUB_SUB);

    jest.spyOn(bookModel, 'exec').mockImplementation(() => Promise.resolve(MockMongooseModel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    beforeEach(() => {
      jest.spyOn(bookModel, 'exec').mockImplementation(() => Promise.resolve(1));
    });

    it('should count books', async () => {
      await booksService.findAll(new ApiQuery());
      expect(bookModel.countDocuments).toHaveBeenCalled();
    });

    it('should find books without filter', async () => {
      await booksService.findAll(new ApiQuery());
      expect(bookModel.find).toHaveBeenCalledWith({});
    });

    it('should find books with filter', async () => {
      await booksService.findAll(new ApiQuery({ test: new RegExp('search', 'i') }));
      expect(bookModel.find).toHaveBeenCalledWith({ test: /search/i });
    });

    it('should skip with default value', async () => {
      await booksService.findAll(new ApiQuery());
      expect(bookModel.skip).toHaveBeenCalledWith(0);
    });

    it('should skip with value from query', async () => {
      await booksService.findAll(new ApiQuery(null, null, 10));
      expect(bookModel.skip).toHaveBeenCalledWith(10);
    });

    it('should limit with default value', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('5');
      await booksService.findAll(new ApiQuery());
      expect(bookModel.limit).toHaveBeenCalledWith(5);
    });

    it('should limit with value from query', async () => {
      await booksService.findAll(new ApiQuery(null, 10, null));
      expect(bookModel.limit).toHaveBeenCalledWith(10);
    });

    it('should sort without value from query', async () => {
      await booksService.findAll(new ApiQuery());
      expect(bookModel.sort).toHaveBeenCalledWith(null);
    });

    it('should sort with value from query', async () => {
      const order = { test: -1 };
      await booksService.findAll(new ApiQuery(null, null, null, order));
      expect(bookModel.sort).toHaveBeenCalledWith(order);
    });
  });

  describe('findBySlug()', () => {
    it('should find book by slug and increment views by one', async () => {
      const slug = 'slug';
      await booksService.findBySlug(slug);
      expect(bookModel.findOneAndUpdate).toHaveBeenCalledWith({ slug }, { $inc: { views: 1 } });
    });
  });

  describe('findById()', () => {
    it('should find book by id', async () => {
      const id = 'book_id';
      await booksService.findById(id);
      expect(bookModel.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('findBestBooks()', () => {
    beforeEach(() => {
      jest.spyOn(bookModel, 'exec').mockImplementation(() => Promise.resolve(1));
    });

    it('should count best books', async () => {
      await booksService.findBestBooks(new ApiQuery());
      expect(bookModel.countDocuments).toHaveBeenCalled();
    });

    it('should find books with rating of 5', async () => {
      await booksService.findBestBooks(new ApiQuery());
      expect(bookModel.find).toHaveBeenCalledWith({ rating: 5 });
    });

    it('should skip with default value', async () => {
      await booksService.findBestBooks(new ApiQuery());
      expect(bookModel.skip).toHaveBeenCalledWith(0);
    });

    it('should skip with value from query', async () => {
      await booksService.findBestBooks(new ApiQuery(null, null, 10));
      expect(bookModel.skip).toHaveBeenCalledWith(10);
    });

    it('should limit with default value', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('5');
      await booksService.findBestBooks(new ApiQuery());
      expect(bookModel.limit).toHaveBeenCalledWith(5);
    });

    it('should limit with value from query', async () => {
      await booksService.findBestBooks(new ApiQuery(null, 10, null));
      expect(bookModel.limit).toHaveBeenCalledWith(10);
    });
  });

  describe('create()', () => {
    it('should create book', async () => {
      await booksService.create(book, userId);
      expect(bookModel.save).toHaveBeenCalled();
    });

    it('should create log', async () => {
      await booksService.create(book, userId);
      expect(logsService.create).toHaveBeenCalled();
    });

    it('should reject book creation', async () => {
      const error = { message: 'error' };

      jest.spyOn(bookModel, 'save').mockImplementationOnce(() => Promise.reject(error));

      try {
        await booksService.create(book, userId);
      } catch (err) {
        expect(err).toEqual(error);
      }
    });
  });

  describe('update()', () => {
    it('should find book by id', async () => {
      await booksService.update(book._id, { ...book }, userId);
      expect(bookModel.findById).toHaveBeenCalledWith(book._id);
    });

    it('should throw error if book is not found', async () => {
      jest.spyOn(bookModel, 'exec').mockImplementationOnce(() => Promise.resolve(null));

      try {
        await booksService.update(book._id, { ...book }, userId);
      } catch (err) {
        expect(err.message.message).toEqual(BOOK_VALIDATION_ERRORS.BOOK_NOT_FOUND_ERR);
      }
    });

    it('should not remove old cover if it was not changed', async () => {
      await booksService.update(book._id, { ...book }, userId);
      expect(filesService.deleteFromBucket).not.toHaveBeenCalled();
    });

    it('should not remove old epub if it was not changed', async () => {
      await booksService.update(book._id, { ...book }, userId);
      expect(filesService.deleteFromBucket).not.toHaveBeenCalled();
    });

    it('should remove old cover if it was changed', async () => {
      await booksService.update(
        book._id,
        {
          ...book,
          coverUrl: 'storage/newCoverUrl'
        },
        userId
      );
      expect(filesService.deleteFromBucket).toHaveBeenCalledWith('cover.png');
    });

    it('should remove old epub if it was changed', async () => {
      await booksService.update(
        book._id,
        {
          ...book,
          epubUrl: 'storage/newEpubUrl'
        },
        userId
      );
      expect(filesService.deleteFromBucket).toHaveBeenCalledWith('book.epub');
    });

    it('should throw error if epub saving failed', async () => {
      jest
        .spyOn(filesService, 'deleteFromBucket')
        .mockImplementationOnce(() => Promise.resolve(new Error('error')));

      try {
        await booksService.update(
          book._id,
          {
            ...book,
            epubUrl: 'storage/newEpubUrl'
          },
          userId
        );
      } catch (err) {
        expect(err).toEqual('avatarUrl');
      }
    });

    it('should save updated book', async () => {
      await booksService.update(book._id, { ...book }, userId);
      expect(bookModel.save).toHaveBeenCalled();
    });

    it('should create log', async () => {
      await booksService.update(book._id, { ...book }, userId);
      expect(logsService.create).toHaveBeenCalled();
    });

    it('should reject book update', async () => {
      const error = { message: 'error' };

      jest.spyOn(bookModel, 'save').mockImplementationOnce(() => Promise.reject(error));

      try {
        await booksService.update(book._id, { ...book }, userId);
      } catch (err) {
        expect(err).toEqual(error);
      }
    });
  });

  describe('rateBook()', () => {
    it('should find book by id', async () => {
      await booksService.rateBook(book._id, 5, userId);
      expect(bookModel.findById).toHaveBeenCalledWith(book._id);
    });

    it('should throw error if book is not found', async () => {
      jest.spyOn(bookModel, 'exec').mockImplementationOnce(() => Promise.resolve(null));

      try {
        await booksService.rateBook(book._id, 5, userId);
      } catch (err) {
        expect(err.message.message).toEqual(BOOK_VALIDATION_ERRORS.BOOK_NOT_FOUND_ERR);
      }
    });

    it('should save updated book', async () => {
      await booksService.rateBook(book._id, 5, userId);
      expect(bookModel.save).toHaveBeenCalled();
    });

    it('should create log', async () => {
      await booksService.rateBook(book._id, 5, userId);
      expect(logsService.create).toHaveBeenCalled();
    });

    it('should publish event', async () => {
      await booksService.rateBook(book._id, 5, userId);
      expect(pubSub.publish).toHaveBeenCalled();
    });
  });
});
