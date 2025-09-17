import { BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ApiQuery, FilterInput, GqlAuthGuard, type RequestWithUser } from '@bookapp/api/shared';
import { convertToMongoSortQuery } from '@bookapp/utils/api';

import type { RegistrationResponseJSON } from '@simplewebauthn/server';

import { PASSKEY_VALIDATION_ERRORS } from './constants';
import { PasskeysService } from './passkeys.service';

declare module 'express-session' {
  interface SessionData {
    passkeyRegistrationOptions: PublicKeyCredentialCreationOptionsJSON;
  }
}

@Resolver()
export class PasskeysResolver {
  private readonly logger = new Logger(PasskeysResolver.name);

  constructor(private readonly passkeysService: PasskeysService) {}

  @Query('passkeys')
  @UseGuards(GqlAuthGuard)
  getPasskeys(@Args() args: FilterInput, @Context('req') req: RequestWithUser) {
    const { skip, first, orderBy } = args;
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;

    return this.passkeysService.findAll(req.user.id, new ApiQuery(undefined, first, skip, order));
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async generateRegistrationOptions(@Context('req') req: RequestWithUser) {
    const options = await this.passkeysService.generateRegistrationOptions(req.user);

    req.session.passkeyRegistrationOptions = options;

    return options;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async verifyRegistrationResponse(
    @Args('response') response: RegistrationResponseJSON,
    @Context('req') req: RequestWithUser
  ) {
    const storedOptions = req.session.passkeyRegistrationOptions;
    const expectedOrigin = req.headers.origin;

    if (!storedOptions) {
      this.logger.error('No valid registration options found in session');
      throw new BadRequestException(PASSKEY_VALIDATION_ERRORS.PASSKEY_VERIFICATION_FAILED_ERR);
    }

    const passkey = await this.passkeysService.verifyRegistrationResponse(
      req.user,
      response,
      storedOptions,
      expectedOrigin
    );

    delete req.session.passkeyRegistrationOptions;

    return passkey;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  updatePasskey(
    @Args('id') id: string,
    @Args('label') label: string,
    @Context('req') req: RequestWithUser
  ) {
    return this.passkeysService.update(req.user.id, id, label);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deletePasskey(@Args('id') id: string, @Context('req') req: RequestWithUser) {
    await this.passkeysService.delete(req.user.id, id);

    return true;
  }
}
