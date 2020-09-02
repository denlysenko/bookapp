import { AUTH_ERRORS } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import { JwtPayload } from '@bookapp/shared/interfaces';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload, done: any) {
    const user = await this.usersService.findById(payload.id);

    if (!user) {
      return done(new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR), false);
    }

    done(null, user);
  }
}
