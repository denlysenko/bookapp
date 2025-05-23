import { LogDto, LogsService } from '@bookapp/api/logs';
import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import { BOOKMARKS, UserActions } from '@bookapp/shared/enums';
import { ApiResponse } from '@bookapp/shared/interfaces';

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { BOOKMARK_ERRORS } from './constants';
import { BookmarkModel } from './interfaces/bookmark';

@Injectable()
export class BookmarksService {
  private readonly logger = new Logger(BookmarksService.name);

  constructor(
    @InjectModel(ModelNames.BOOKMARK)
    private readonly bookmarkModel: Model<BookmarkModel>,
    private readonly configService: ConfigService,
    private readonly logsService: LogsService
  ) {}

  async getByType(query: ApiQuery): Promise<ApiResponse<BookmarkModel>> {
    const { filter, skip, first } = query;
    const where = filter ?? {};
    const [count, rows] = await Promise.all([
      this.bookmarkModel.countDocuments(where).exec(),
      this.bookmarkModel
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

  getByUserAndBook(userId: string, bookId: string): Promise<BookmarkModel[]> {
    return this.bookmarkModel.find({ userId, bookId }).exec();
  }

  async addToBookmarks(type: string, userId: string, bookId: string): Promise<BookmarkModel> {
    const bookmark = await this.bookmarkModel.findOne({ type, bookId, userId }).exec();

    if (bookmark) {
      this.logger.error(`Book: ${bookId} already added to ${type} bookmarks by user: ${userId}`);
      throw new BadRequestException(BOOKMARK_ERRORS.BOOKMARK_UNIQUE_ERR);
    }

    // BOOK_ADDED_TO_MUSTREAD
    const newBookmark = new this.bookmarkModel({ type, userId, bookId });
    await newBookmark.save();
    await this.logsService.create(
      new LogDto(userId, UserActions[`BOOK_ADDED_TO_${BOOKMARKS[type]}`], bookId)
    );
    this.logger.log(`Book: ${bookId} added to ${type} bookmarks by user: ${userId}`);

    return newBookmark;
  }

  async removeFromBookmarks(type: string, userId: string, bookId: string) {
    const bookmark = await this.bookmarkModel.findOne({ type, bookId, userId }).exec();

    if (!bookmark) {
      this.logger.error(`Book: ${bookId} not found in ${type} bookmarks for user: ${userId}`);
      throw new NotFoundException(BOOKMARK_ERRORS.BOOKMARK_NOT_FOUND_ERR);
    }

    // BOOK_REMOVED_FROM_MUSTREAD
    await bookmark.deleteOne().exec();
    await this.logsService.create(
      new LogDto(userId, UserActions[`BOOK_REMOVED_FROM_${BOOKMARKS[type]}`], bookId)
    );
    this.logger.log(`Book: ${bookId} removed from ${type} bookmarks by user: ${userId}`);

    return bookmark;
  }
}
