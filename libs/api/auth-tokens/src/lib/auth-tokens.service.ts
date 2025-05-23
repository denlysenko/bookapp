import { AUTH_ERRORS, ModelNames } from '@bookapp/api/shared';
import { AuthPayload, JwtPayload, User } from '@bookapp/shared/interfaces';

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { sign, verify } from 'jsonwebtoken';
import { Connection, Document, Model, Types } from 'mongoose';

import { AuthTokenModel } from './interfaces/auth-token';

// do not import from @bookapp/users to avoid circular dependency
interface UserModel extends Omit<User, 'id'>, Document<Types.ObjectId> {}

@Injectable()
export class AuthTokensService {
  private readonly logger = new Logger(AuthTokensService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(ModelNames.AUTH_TOKEN)
    private readonly tokenModel: Model<AuthTokenModel>
  ) {}

  createAccessToken(id: string): string {
    const token = sign({ id }, this.configService.get('ACCESS_TOKEN_SECRET'), {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    this.logger.log(`Created access token for user ${id}`);

    return token;
  }

  async createRefreshToken(id: string): Promise<string> {
    const token = sign({ id }, this.configService.get('REFRESH_TOKEN_SECRET'), {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    await this.tokenModel.create({ token, userId: id });
    this.logger.log(`Created refresh token for user ${id}`);

    return token;
  }

  async refreshTokens(token: string): Promise<AuthPayload> {
    if (!token) {
      this.logger.log('Refresh token is missing');
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);
    }

    const existsToken = await this.tokenModel.findOne({ token }).exec();

    if (!existsToken) {
      this.logger.log('Refresh token does not exist');
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);
    }

    let payload: JwtPayload;

    try {
      payload = verify(token, this.configService.get('REFRESH_TOKEN_SECRET')) as JwtPayload;
    } catch (err) {
      this.logger.log(`Error verifying refresh token: ${err}`);
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);
    }

    const { id } = payload;

    // use Connection instead of UsersService to avoid circular dependency
    const userModel: Model<UserModel> = this.connection.model(ModelNames.USER);
    const user = await userModel.findById(id).exec();

    if (!user) {
      this.logger.log(`User id: ${id} not found`);
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_ERR);
    }

    const [refreshToken] = await Promise.all([
      this.createRefreshToken(user.id),
      this.tokenModel.deleteOne({ token }).exec(),
    ]);

    this.logger.log(`Tokens refreshed for user id: ${id}`);

    return {
      accessToken: this.createAccessToken(user.id),
      refreshToken,
    };
  }

  async revokeUserTokens(userId: string) {
    await this.tokenModel.deleteMany({ userId }).exec();
    this.logger.log(`Tokens revoked for user id: ${userId}`);
  }

  async removeRefreshToken(token: string) {
    await this.tokenModel.deleteOne({ token }).exec();
    this.logger.log('Refresh token removed');
  }
}
