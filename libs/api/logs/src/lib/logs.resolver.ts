import { BooksDataLoader } from '@bookapp/api/dataloaders';
import { PUB_SUB } from '@bookapp/api/graphql';
import { ApiQuery, FilterInput, GqlAuthGuard, RequestWithUser } from '@bookapp/api/shared';
import { Log } from '@bookapp/shared/interfaces';
import { convertToMongoSortQuery } from '@bookapp/utils';

import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';

import { PubSub } from 'graphql-subscriptions';

import { LogsService } from './logs.service';

@Resolver('Log')
export class LogsResolver {
  constructor(
    private readonly logsService: LogsService,
    private readonly booksDataLoader: BooksDataLoader,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  @Query('logs')
  @UseGuards(GqlAuthGuard)
  getLogs(@Args() args: FilterInput, @Context('req') req: RequestWithUser) {
    const userId = req.user._id;
    const { skip, first, orderBy } = args;
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;

    return this.logsService.findAll(new ApiQuery({ userId }, first, skip, order));
  }

  @Subscription('logCreated', {
    filter: (payload, variables) => payload.logCreated.userId.equals(variables.userId),
  })
  logCreated() {
    return this.pubSub.asyncIterator('logCreated');
  }

  @ResolveField('book')
  getBook(@Parent() log: Log) {
    const { bookId } = log;
    return this.booksDataLoader.load(bookId);
  }
}
