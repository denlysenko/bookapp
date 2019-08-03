import { PUB_SUB } from '@bookapp/api/graphql';
import {
  ApiQuery,
  FilterInput,
  GqlAuthGuard,
  RequestWithUser
} from '@bookapp/api/shared';
import { convertToMongoSortQuery } from '@bookapp/api/utils';
import { Log } from '@bookapp/shared/models';

import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
  Subscription
} from '@nestjs/graphql';

import { PubSub } from 'graphql-subscriptions';

import { LogsService } from './logs.service';

@Resolver()
export class LogsResolver {
  constructor(
    private readonly logsService: LogsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  @Query('logs')
  @UseGuards(GqlAuthGuard)
  getLogs(@Args() args: FilterInput, @Context('req') req: RequestWithUser) {
    const userId = req.user._id;
    const { skip, first, orderBy } = args;
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;

    return this.logsService.findAll(
      new ApiQuery({ userId }, first, skip, order)
    );
  }

  @Subscription('logCreated', {
    filter: (payload, variables) =>
      payload.logCreated.userId.equals(variables.userId)
  })
  @UseGuards(GqlAuthGuard)
  logCreated() {
    return this.pubSub.asyncIterator('logCreated');
  }

  // TODO: use DataLoader later
  @ResolveProperty('book')
  getBook(@Parent() log: Log) {
    const { bookId } = log;
    return bookId;
  }
}
