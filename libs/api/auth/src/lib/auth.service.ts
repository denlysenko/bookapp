import { ConfigService } from '@bookapp/api/config';
import { UserDto, UsersService } from '@bookapp/api/users';
import { AuthPayload, User } from '@bookapp/shared/models';

import { BadRequestException, Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

import { AUTH_ERRORS } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
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

    return { token: this.createToken(user._id) };
  }

  async signup(user: UserDto): Promise<AuthPayload> {
    const newUser = await this.usersService.create(user);
    return { token: this.createToken(newUser._id) };
  }

  validate({ id }): Promise<User> {
    return this.usersService.findById(id);
  }

  createToken(id: string): string {
    return jwt.sign({ id }, this.configService.get('JWT_SECRET'), {
      expiresIn: parseInt(this.configService.get('TOKEN_EXPIRATION_TIME'), 10)
    });
  }
}
