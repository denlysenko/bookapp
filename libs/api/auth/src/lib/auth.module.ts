import { AuthTokensModule } from '@bookapp/api/auth-tokens';
import { PasskeysModule } from '@bookapp/api/passkeys';
import { UsersModule } from '@bookapp/api/users';

import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule, AuthTokensModule, PasskeysModule],
  providers: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
