import { Injectable } from '@angular/core';

import { ME_QUERY, User } from '@bookapp/shared';

import { Query } from 'apollo-angular';

@Injectable()
export class MeQuery extends Query<{ me: User }> {
  document = ME_QUERY;
}
