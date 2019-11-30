import { CommentsService } from '@bookapp/api/comments';
import { PUB_SUB } from '@bookapp/api/graphql';
import { ApiQuery, GqlAuthGuard, RequestWithUser, Roles, RolesGuard } from '@bookapp/api/shared';
import { Book, ROLES } from '@bookapp/shared';
import { convertToMongoSortQuery } from '@bookapp/utils';

import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
  Subscription
} from '@nestjs/graphql';

import { PubSub } from 'graphql-subscriptions';

import { BooksService } from './books.service';
import { BookDto } from './dto/book';
import { BookFilterInput } from './interfaces/book-filter-input';

@Resolver('Book')
export class BooksResolvers {
  constructor(
    private readonly booksService: BooksService,
    private readonly commentsService: CommentsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  @Query('books')
  @UseGuards(GqlAuthGuard)
  getBooks(@Args() args: BookFilterInput) {
    const { paid, filter, skip, first, orderBy } = args;
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;
    let where: { [key: string]: any } = { paid };

    if (filter) {
      where = {
        ...where,
        [filter.field]: new RegExp(`${filter.search}`, 'i')
      };
    }

    return this.booksService.findAll(new ApiQuery(where, first, skip, order));
  }

  @Query('bestBooks')
  @UseGuards(GqlAuthGuard)
  getBestBooks(@Args('skip') skip: number, @Args('first') first: number) {
    return this.booksService.findBestBooks(new ApiQuery(null, first, skip));
  }

  @Query('book')
  @UseGuards(GqlAuthGuard)
  async getBook(@Args('slug') slug: string) {
    return this.booksService.findBySlug(slug);
  }

  @ResolveProperty('comments')
  async getComments(@Parent() book: Book) {
    const { _id } = book;
    return this.commentsService.getAllForBook(_id);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  async createBook(@Args('book') book: BookDto, @Context('req') req: RequestWithUser) {
    const userId = req.user._id;
    return this.booksService.create(book, userId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  async updateBook(
    @Args('id') id: string,
    @Args('book') book: BookDto,
    @Context('req') req: RequestWithUser
  ) {
    const userId = req.user._id;
    return this.booksService.update(id, book, userId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  rateBook(
    @Args('id') id: string,
    @Args('rate') rate: number,
    @Context('req') req: RequestWithUser
  ) {
    const userId = req.user._id;
    return this.booksService.rateBook(id, rate, userId);
  }

  @Subscription()
  bookRated() {
    return this.pubSub.asyncIterator('bookRated');
  }
}
