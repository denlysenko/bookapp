import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { PasskeysService } from '@bookapp/api/passkeys';
import { AUTH_ERRORS } from '@bookapp/api/shared';
import { UserDto, UsersService } from '@bookapp/api/users';
import type { AuthPayload } from '@bookapp/shared/interfaces';

import type { AuthenticationResponseJSON } from '@simplewebauthn/server';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authTokensService: AuthTokensService,
    private readonly usersService: UsersService,
    private readonly passkeysService: PasskeysService
  ) {}

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.error(`User with email ${email} not found`);
      throw new BadRequestException(AUTH_ERRORS.INCORRECT_EMAIL_OR_PASSWORD_ERR);
    }

    if (!(await user.authenticate(password))) {
      this.logger.error(`Incorrect password for user with email ${email}`);
      throw new BadRequestException(AUTH_ERRORS.INCORRECT_EMAIL_OR_PASSWORD_ERR);
    }

    return {
      accessToken: this.authTokensService.createAccessToken(user.id),
      refreshToken: await this.authTokensService.createRefreshToken(user.id),
    };
  }

  async signup(user: UserDto): Promise<AuthPayload> {
    const newUser = await this.usersService.create(user);

    this.logger.log(`User with email ${newUser.email} created`);

    return {
      accessToken: this.authTokensService.createAccessToken(newUser.id),
      refreshToken: await this.authTokensService.createRefreshToken(newUser.id),
    };
  }

  async logout(token: string): Promise<boolean> {
    await this.authTokensService.removeRefreshToken(token);
    this.logger.log('User logged out');

    return true;
  }

  generateAuthenticationOptions() {
    return this.passkeysService.generateAuthenticationOptions();
  }

  async verifyAuthenticationResponse(
    response: AuthenticationResponseJSON,
    expectedChallenge: string,
    expectedOrigin: string
  ): Promise<AuthPayload> {
    const user = await this.passkeysService.verifyAuthenticationResponse(
      response,
      expectedChallenge,
      expectedOrigin
    );

    return {
      accessToken: this.authTokensService.createAccessToken(user.id),
      refreshToken: await this.authTokensService.createRefreshToken(user.id),
    };
  }
}
