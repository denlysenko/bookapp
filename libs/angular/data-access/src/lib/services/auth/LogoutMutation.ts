import { Injectable } from '@angular/core';

import { LOGOUT_MUTATION } from '@bookapp/shared';

import { Mutation } from 'apollo-angular';

@Injectable()
export class LogoutMutation extends Mutation<{ logout: boolean }> {
  document = LOGOUT_MUTATION;
}
