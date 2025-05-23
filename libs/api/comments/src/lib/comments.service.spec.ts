import { PUB_SUB } from '@bookapp/api/graphql';
import { LogsService } from '@bookapp/api/logs';
import { ModelNames } from '@bookapp/api/shared';
import { UserActions } from '@bookapp/shared/enums';
import {
  MockConfigService,
  MockLogsService,
  MockModel,
  MockMongooseModel,
} from '@bookapp/testing/api';

import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { PubSub } from 'graphql-subscriptions';

import { CommentsService } from './comments.service';

const bookId = 'book_id';
const userId = 'user_id';
const text = 'comment';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let commentModel: any;
  let logsService: LogsService;
  let pubSub: PubSub;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: ConfigService,
          useValue: MockConfigService,
        },
        {
          provide: getModelToken(ModelNames.COMMENT),
          useValue: MockModel,
        },
        {
          provide: LogsService,
          useValue: MockLogsService,
        },
        {
          provide: PUB_SUB,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    logsService = module.get<LogsService>(LogsService);
    commentModel = module.get(getModelToken(ModelNames.COMMENT));
    pubSub = module.get<PubSub>(PUB_SUB);

    jest.spyOn(commentModel, 'exec').mockImplementation(() => Promise.resolve(MockMongooseModel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllForBook()', () => {
    it('should find comments for particular book', async () => {
      await commentsService.getAllForBook(bookId);
      expect(commentModel.find).toHaveBeenCalledWith({ bookId });
    });
  });

  describe('saveForBook()', () => {
    it('should save comment', async () => {
      await commentsService.saveForBook(bookId, userId, text);
      expect(commentModel.save).toHaveBeenCalled();
    });

    it('should create log', async () => {
      await commentsService.saveForBook(bookId, userId, text);
      expect(logsService.create).toHaveBeenCalledWith({
        action: UserActions.COMMENT_ADDED,
        bookId,
        userId,
      });
    });

    it('should publish event', async () => {
      await commentsService.saveForBook(bookId, userId, text);
      expect(pubSub.publish).toHaveBeenCalled();
    });
  });
});
