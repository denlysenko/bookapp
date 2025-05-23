import { BooksDataLoader } from '@bookapp/api/dataloaders';
import { ApiQuery, GqlAuthGuard, type RequestWithUser } from '@bookapp/api/shared';
import type { Bookmark } from '@bookapp/shared/interfaces';

import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { BookmarksService } from './bookmarks.service';

@Resolver('Bookmark')
export class BookmarksResolver {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @ResolveField('book')
  async getBook(
    @Parent() bookmark: Bookmark,
    @Context('booksLoader') booksLoader: BooksDataLoader
  ) {
    const { bookId } = bookmark;
    return booksLoader.load(bookId);
  }

  @Query('bookmarks')
  @UseGuards(GqlAuthGuard)
  getBookmarks(
    @Args('type') type: string,
    @Args('skip') skip: number,
    @Args('first') first: number,
    @Context('req') req: RequestWithUser
  ) {
    const userId = req.user.id;
    return this.bookmarksService.getByType(new ApiQuery({ type, userId }, first, skip));
  }

  @Query('userBookmarksByBook')
  @UseGuards(GqlAuthGuard)
  getUserBookmarksByBook(@Args('bookId') bookId: string, @Context('req') req: RequestWithUser) {
    const userId = req.user.id;
    return this.bookmarksService.getByUserAndBook(userId, bookId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  addToBookmarks(
    @Args('type') type: string,
    @Args('bookId') bookId: string,
    @Context('req') req: RequestWithUser
  ) {
    const userId = req.user.id;
    return this.bookmarksService.addToBookmarks(type, userId, bookId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  removeFromBookmarks(
    @Args('type') type: string,
    @Args('bookId') bookId: string,
    @Context('req') req: RequestWithUser
  ) {
    const userId = req.user.id;
    return this.bookmarksService.removeFromBookmarks(type, userId, bookId);
  }
}
