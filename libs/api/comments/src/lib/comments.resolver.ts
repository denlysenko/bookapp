import type { UsersDataLoader } from '@bookapp/api/dataloaders';
import { PUB_SUB } from '@bookapp/api/graphql';
import { GqlAuthGuard, type RequestWithUser } from '@bookapp/api/shared';
import type { Comment } from '@bookapp/shared/interfaces';

import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';

import { PubSub } from 'graphql-subscriptions';

import { CommentsService } from './comments.service';

@Resolver('Comment')
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  @ResolveField('author')
  async getAuthor(
    @Parent() comment: Comment,
    @Context('usersLoader') usersLoader: UsersDataLoader
  ) {
    const { authorId } = comment;
    return usersLoader.load(authorId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async addComment(
    @Args('bookId') bookId: string,
    @Args('text') text: string,
    @Context('req') req: RequestWithUser
  ) {
    const authorId = req.user.id;
    return this.commentsService.saveForBook(bookId, authorId, text);
  }

  @Subscription()
  commentAdded() {
    return this.pubSub.asyncIterableIterator('commentAdded');
  }
}
