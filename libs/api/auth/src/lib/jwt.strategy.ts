import { ConfigService } from '@bookapp/api/config';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { AUTH_ERRORS } from './constants';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate(payload: JwtPayload, done: any) {
    const user = await this.authService.validate(payload);
    if (!user) {
      return done(
        new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR),
        false
      );
    }

    done(null, user);
  }
}
