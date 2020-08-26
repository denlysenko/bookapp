import { Injectable } from '@angular/core';

import { AuthPayload, LOGIN_MUTATION } from '@bookapp/shared';

import { Mutation } from 'apollo-angular';

@Injectable()
export class LoginMutation extends Mutation<{ login: AuthPayload }> {
  document = LOGIN_MUTATION;
}
