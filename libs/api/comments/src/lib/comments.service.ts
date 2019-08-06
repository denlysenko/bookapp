import { LogDto, LogsService } from '@bookapp/api/logs';
import { UserActions } from '@bookapp/shared/models';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { COMMENT_MODEL_NAME } from './constants';
import { CommentModel } from './interfaces/comment';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(COMMENT_MODEL_NAME)
    private readonly commentModel: Model<CommentModel>,
    private readonly logsService: LogsService
  ) {}

  getAllForBook(bookId: string) {
    return this.commentModel.find({ bookId }).exec();
  }

  async saveForBook(bookId: string, authorId: string, text: string) {
    const newComment = new this.commentModel({
      bookId,
      authorId,
      text
    });

    await newComment.save();
    await this.logsService.create(
      new LogDto(authorId, UserActions.COMMENT_ADDED, bookId)
    );

    return newComment;
  }
}
