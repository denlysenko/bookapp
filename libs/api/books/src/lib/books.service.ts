import { FilesService } from '@bookapp/api/files';
import { PUB_SUB } from '@bookapp/api/graphql';
import { LogDto, LogsService } from '@bookapp/api/logs';
import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import { UserActions } from '@bookapp/shared/enums';
import { ApiResponse } from '@bookapp/shared/interfaces';
import { extractFileKey } from '@bookapp/utils/api';

import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { PubSub } from 'graphql-subscriptions';
import { Model } from 'mongoose';

import { BOOK_VALIDATION_ERRORS } from './constants';
import { BookDto } from './dto/book';
import { BookModel } from './interfaces/book';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectModel(ModelNames.BOOK) private readonly bookModel: Model<BookModel>,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
    private readonly logsService: LogsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  async findAll(query?: ApiQuery): Promise<ApiResponse<BookModel>> {
    const { filter, skip, first, order } = query;
    const where = filter ?? {};
    const [count, rows] = await Promise.all([
      this.bookModel.countDocuments(where).exec(),
      this.bookModel
        .find(where)
        .skip(skip ?? 0)
        .limit(first ?? parseInt(this.configService.get('DEFAULT_LIMIT'), 10))
        .sort(order)
        .exec(),
    ]);

    return {
      count,
      rows,
    };
  }

  findBySlug(slug: string): Promise<BookModel> {
    return this.bookModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } }).exec();
  }

  findById(id: string): Promise<BookModel> {
    return this.bookModel.findById(id).exec();
  }

  async findBestBooks(query?: ApiQuery): Promise<ApiResponse<BookModel>> {
    const { skip, first } = query;
    const where = { rating: 5 };
    const [count, rows] = await Promise.all([
      this.bookModel.countDocuments(where).exec(),
      this.bookModel
        .find(where)
        .skip(skip ?? 0)
        .limit(first ?? parseInt(this.configService.get('DEFAULT_LIMIT'), 10))
        .exec(),
    ]);

    return {
      count,
      rows,
    };
  }

  async create(book: BookDto, userId: string): Promise<BookModel> {
    const newBook = new this.bookModel(book);

    await newBook.save();
    await this.logsService.create(new LogDto(userId, UserActions.BOOK_CREATED, newBook.id));
    this.logger.log(`Book: ${newBook.id} created`);

    return newBook;
  }

  async update(id: string, updatedBook: BookDto, userId: string): Promise<BookModel> {
    const book = await this.bookModel.findById(id).exec();

    if (!book) {
      this.logger.error(`Book not found with id: ${id}`);
      throw new NotFoundException(BOOK_VALIDATION_ERRORS.BOOK_NOT_FOUND_ERR);
    }

    const filePromises = [];
    // remove old files from bucket first if new ones are adding
    if (book.coverUrl && updatedBook.coverUrl && book.coverUrl !== updatedBook.coverUrl) {
      filePromises.push(this.filesService.deleteFromBucket(extractFileKey(book.coverUrl)));
    }

    if (book.epubUrl && updatedBook.epubUrl && book.epubUrl !== updatedBook.epubUrl) {
      filePromises.push(this.filesService.deleteFromBucket(extractFileKey(book.epubUrl)));
    }

    if (filePromises.length) {
      try {
        await Promise.all(filePromises);
      } catch (err) {
        this.logger.error(`Error deleting files from bucket: ${err}`);
        throw new BadRequestException(err);
      }
    }

    Object.assign(book, updatedBook);

    await book.save();
    await this.logsService.create(new LogDto(userId, UserActions.BOOK_UPDATED, book.id));
    this.logger.log(`Book ${book.id} updated`);

    return book;
  }

  async rateBook(id: string, newRate: number, userId: string): Promise<BookModel> {
    const book = await this.bookModel.findById(id).exec();

    if (!book) {
      this.logger.error(`Book ${id} not found`);
      throw new NotFoundException(BOOK_VALIDATION_ERRORS.BOOK_NOT_FOUND_ERR);
    }

    const total_rates = book.total_rates + 1;
    const total_rating = book.total_rating + newRate;
    const rating = Math.ceil(total_rating / total_rates);

    book.total_rates = total_rates;
    book.total_rating = total_rating;
    book.rating = rating;

    await book.save();
    await this.logsService.create(new LogDto(userId, UserActions.BOOK_RATED, book.id));
    this.pubSub.publish('bookRated', { bookRated: book });
    this.logger.log(`Book ${book.id} rated`);

    return book;
  }
}
