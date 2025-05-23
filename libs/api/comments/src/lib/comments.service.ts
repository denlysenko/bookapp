import { PUB_SUB } from '@bookapp/api/graphql';
import { LogDto, LogsService } from '@bookapp/api/logs';
import { ModelNames } from '@bookapp/api/shared';
import { UserActions } from '@bookapp/shared/enums';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PubSub } from 'graphql-subscriptions';
import { Model } from 'mongoose';

import { CommentModel } from './interfaces/comment';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectModel(ModelNames.COMMENT)
    private readonly commentModel: Model<CommentModel>,
    private readonly logsService: LogsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  getAllForBook(bookId: string) {
    return this.commentModel.find({ bookId }).exec();
  }

  async saveForBook(bookId: string, authorId: string, text: string) {
    const newComment = new this.commentModel({
      bookId,
      authorId,
      text,
    });

    await newComment.save();
    await this.logsService.create(new LogDto(authorId, UserActions.COMMENT_ADDED, bookId));
    this.pubSub.publish('commentAdded', { commentAdded: newComment });
    this.logger.log(`Comment ${newComment.id} added for book ${bookId}`);

    return newComment;
  }
}
