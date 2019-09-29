import { ModelNames } from '@bookapp/api/shared';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthTokensController } from './auth-tokens.controller';
import { AuthTokensService } from './auth-tokens.service';
import { AuthTokenSchema } from './schemas/auth-token';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.AUTH_TOKEN, schema: AuthTokenSchema }
    ])
  ],
  controllers: [AuthTokensController],
  providers: [AuthTokensService],
  exports: [AuthTokensService]
})
export class AuthTokensModule {}
