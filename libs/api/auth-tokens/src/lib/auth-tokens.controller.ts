import { REFRESH_TOKEN_HEADER } from '@bookapp/shared';

import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';

import { AuthTokensService } from './auth-tokens.service';

@Controller()
export class AuthTokensController {
  constructor(private readonly authTokensService: AuthTokensService) {}

  @Post('refreshTokens')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Headers(REFRESH_TOKEN_HEADER) refreshToken: string) {
    return this.authTokensService.refreshTokens(refreshToken);
  }
}
