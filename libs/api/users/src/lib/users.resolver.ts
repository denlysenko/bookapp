import {
  ApiQuery,
  FilterInput,
  GqlAuthGuard,
  RequestWithUser,
  Roles,
  RolesGuard,
} from '@bookapp/api/shared';
import { ROLES } from '@bookapp/shared/enums';
import { convertToMongoSortQuery } from '@bookapp/utils';

import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserDto } from './dto/user';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  getUsers(@Args() args: FilterInput) {
    const { filter, skip, first, orderBy } = args;
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;

    return this.usersService.findAll(
      new ApiQuery(
        filter && { [filter.field]: new RegExp(`${filter.search}`, 'i') },
        first,
        skip,
        order
      )
    );
  }

  @Query('user')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  me(@Context('req') req: RequestWithUser) {
    // we already have user after AuthGuard
    return req.user;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  updateUser(@Args('id') id: string, @Args('user') user: UserDto) {
    return this.usersService.update(id, user);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  changePassword(
    @Args('oldPassword') oldPassword: string,
    @Args('password') newPassword: string,
    @Context('req') req: RequestWithUser
  ) {
    const id = req.user._id;
    return this.usersService.changePassword(id, oldPassword, newPassword);
  }

  @Mutation()
  requestResetPassword(@Args('email') email: string) {
    return this.usersService.requestResetPassword(email);
  }

  @Mutation()
  resetPassword(@Args('token') token: string, @Args('newPassword') newPassword: string) {
    return this.usersService.resetPassword(token, newPassword);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  deleteUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}
