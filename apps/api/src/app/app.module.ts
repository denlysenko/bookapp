import { Module } from '@nestjs/common';

import { GraphqlModule } from '@bookapp/api/graphql';

@Module({
  imports: [GraphqlModule]
})
export class AppModule {}
