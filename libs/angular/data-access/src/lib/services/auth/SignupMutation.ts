import { Injectable } from '@angular/core';

import { AuthPayload, SIGNUP_MUTATION } from '@bookapp/shared';

import { Mutation } from 'apollo-angular';

@Injectable()
export class SignupMutation extends Mutation<{ signup: AuthPayload }> {
  document = SIGNUP_MUTATION;
}
