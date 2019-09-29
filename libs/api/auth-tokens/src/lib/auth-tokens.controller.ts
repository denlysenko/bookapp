import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthTokensService } from './auth-tokens.service';

@Controller()
export class AuthTokensController {
  constructor(private readonly authTokensService: AuthTokensService) {}

  @Post('refreshTokens')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authTokensService.refreshTokens(refreshToken);
  }
}
