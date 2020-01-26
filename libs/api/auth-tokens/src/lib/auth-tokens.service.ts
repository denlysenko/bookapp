import { AUTH_ERRORS, ModelNames } from '@bookapp/api/shared';
import { AuthPayload, JwtPayload, User } from '@bookapp/shared';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken, InjectModel } from '@nestjs/mongoose';

import { sign, verify } from 'jsonwebtoken';
import { Connection, Document, Model } from 'mongoose';

import { AuthTokenModel } from './interfaces/auth-token';

// do not import from @bookapp/users to avoid circular dependency
interface UserModel extends User, Document {}

@Injectable()
export class AuthTokensService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(getConnectionToken()) private readonly connection: Connection,
    @InjectModel(ModelNames.AUTH_TOKEN)
    private readonly tokenModel: Model<AuthTokenModel>
  ) {}

  createAccessToken(id: string): string {
    return sign({ id }, this.configService.get('ACCESS_TOKEN_SECRET'), {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')
    });
  }

  async createRefreshToken(id: string): Promise<string> {
    const token = sign({ id }, this.configService.get('REFRESH_TOKEN_SECRET'), {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')
    });

    await this.tokenModel.create({ token, userId: id });

    return token;
  }

  async refreshTokens(token: string): Promise<AuthPayload> {
    if (!token) {
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);
    }

    const existsToken = await this.tokenModel.findOne({ token }).exec();

    if (!existsToken) {
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);
    }

    let payload: JwtPayload;

    try {
      payload = verify(token, this.configService.get('REFRESH_TOKEN_SECRET')) as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);
    }

    const { id } = payload;

    // use Connection instead of UsersService to avoid circular dependency
    const userModel: Model<UserModel> = this.connection.model(ModelNames.USER);
    const user = await userModel.findById(id).exec();

    if (!user) {
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);
    }

    const [refreshToken] = await Promise.all([
      this.createRefreshToken(user._id),
      this.tokenModel.deleteOne({ token }).exec()
    ]);

    return {
      accessToken: this.createAccessToken(user._id),
      refreshToken
    };
  }

  revokeUserTokens(userId: string) {
    return this.tokenModel.deleteMany({ userId }).exec();
  }

  removeRefreshToken(token: string) {
    return this.tokenModel.deleteOne({ token }).exec();
  }
}
