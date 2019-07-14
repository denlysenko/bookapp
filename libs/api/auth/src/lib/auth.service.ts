import { ConfigService } from '@bookapp/api/config';
import { UserDto, UserService } from '@bookapp/api/users';
import { AuthPayload, User } from '@bookapp/shared/models';

import { BadRequestException, Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

import { AUTH_ERRORS } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(AUTH_ERRORS.INCORRECT_EMAIL_ERR);
    }

    if (!user.authenticate(password)) {
      throw new BadRequestException(AUTH_ERRORS.INCORRECT_PASSWORD_ERR);
    }

    return { token: this.createToken(user._id) };
  }

  async signup(user: UserDto): Promise<AuthPayload> {
    const newUser = await this.userService.create(user);
    return { token: this.createToken(newUser._id) };
  }

  validate({ id }): Promise<User> {
    return this.userService.findById(id);
  }

  private createToken(id: string): string {
    return jwt.sign({ id }, this.configService.get('JWT_SECRET'), {
      expiresIn: Number(this.configService.get('TOKEN_EXPIRATION_TIME'))
    });
  }
}
