import { AUTH_ERRORS } from '@bookapp/api/shared';
import { UserDto } from '@bookapp/api/users';

import { BadRequestException, Logger } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthenticationResponseJSON } from '@simplewebauthn/server';
import { Request } from 'express';

import { AuthService } from './auth.service';

declare module 'express-session' {
  interface SessionData {
    passkeyAuthenticationOptions: PublicKeyCredentialRequestOptionsJSON;
  }
}

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

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

  @Mutation()
  async generateAuthenticationOptions(@Context('req') req: Request) {
    const options = await this.authService.generateAuthenticationOptions();

    req.session.passkeyAuthenticationOptions = options;

    return options;
  }

  @Mutation()
  async verifyAuthenticationResponse(
    @Args('response') response: AuthenticationResponseJSON,
    @Context('req') req: Request
  ) {
    const storedOptions = req.session.passkeyAuthenticationOptions;

    if (!storedOptions) {
      this.logger.error('No valid authentication options found in session');
      throw new BadRequestException(AUTH_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
    }

    const payload = await this.authService.verifyAuthenticationResponse(
      response,
      storedOptions.challenge,
      req.headers.origin
    );

    delete req.session.passkeyAuthenticationOptions;

    return payload;
  }
}
