import { PUB_SUB } from '@bookapp/api/graphql';
import { GqlAuthGuard, RequestWithUser } from '@bookapp/api/shared';
import { Comment } from '@bookapp/shared/models';

import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveProperty,
  Resolver,
  Subscription
} from '@nestjs/graphql';

import { PubSub } from 'graphql-subscriptions';

import { CommentsService } from './comments.service';

@Resolver()
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  @ResolveProperty('author')
  async getAuthor(@Parent() comment: Comment) {
    const { authorId } = comment;
    // TODO: use Dataloader
    return authorId;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async addComment(
    @Args('bookId') bookId: string,
    @Args('text') text: string,
    @Context('req') req: RequestWithUser
  ) {
    const authorId = req.user._id;
    const comment = await this.commentsService.saveForBook(
      bookId,
      authorId,
      text
    );
    this.pubSub.publish('commentAdded', { commentAdded: comment });
    return comment;
  }

  @Subscription()
  commentAdded() {
    return this.pubSub.asyncIterator('commentAdded');
  }
}
