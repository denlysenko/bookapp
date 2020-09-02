import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { AUTH_ERRORS } from '@bookapp/api/shared';
import { UserDto, UsersService } from '@bookapp/api/users';
import { AuthPayload } from '@bookapp/shared/interfaces';

import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly authTokensService: AuthTokensService,
    private readonly usersService: UsersService
  ) {}

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(AUTH_ERRORS.INCORRECT_EMAIL_ERR);
    }

    if (!user.authenticate(password)) {
      throw new BadRequestException(AUTH_ERRORS.INCORRECT_PASSWORD_ERR);
    }

    return {
      accessToken: this.authTokensService.createAccessToken(user._id),
      refreshToken: await this.authTokensService.createRefreshToken(user._id),
    };
  }

  async signup(user: UserDto): Promise<AuthPayload> {
    const newUser = await this.usersService.create(user);

    return {
      accessToken: this.authTokensService.createAccessToken(newUser._id),
      refreshToken: await this.authTokensService.createRefreshToken(newUser._id),
    };
  }

  async logout(token: string): Promise<boolean> {
    await this.authTokensService.removeRefreshToken(token);

    return true;
  }
}
