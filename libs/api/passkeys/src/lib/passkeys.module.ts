import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ModelNames } from '@bookapp/api/shared';

import { PasskeysResolver } from './passkeys.resolver';
import { PasskeysService } from './passkeys.service';
import { PasskeySchema } from './schemas/passkey';

@Module({
  imports: [MongooseModule.forFeature([{ name: ModelNames.PASSKEY, schema: PasskeySchema }])],
  providers: [PasskeysService, PasskeysResolver],
  exports: [PasskeysService],
})
export class PasskeysModule {}
