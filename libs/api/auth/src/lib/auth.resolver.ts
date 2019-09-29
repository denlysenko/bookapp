import { UserDto } from '@bookapp/api/users';

import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password);
  }

  @Mutation()
  signup(@Args('user') user: UserDto) {
    return this.authService.signup(user);
  }

  @Mutation()
  logout(@Args('refreshToken') token: string) {
    return this.authService.logout(token);
  }
}
