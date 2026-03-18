import { inject, signal } from '@angular/core';

import { CombinedGraphQLErrors } from '@apollo/client/errors';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { PasswordService } from '@bookapp/angular/data-access';
import { ApiError } from '@bookapp/shared/interfaces';

import { finalize } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

const PASSWORD_CHANGE_SUCCESS = 'Password changed!';

export abstract class PasswordPageBase extends BaseComponent {
  readonly #passwordService = inject(PasswordService);
  readonly #feedbackService = inject(FeedbackPlatformService);

  readonly error = signal<ApiError | null>(null);
  readonly loading = signal(false);

  changePassword({ password, oldPassword }) {
    this.loading.set(true);

    this.#passwordService
      .changePassword(password, oldPassword)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe(({ data, error }) => {
        if (data && data.changePassword) {
          this.#feedbackService.success(PASSWORD_CHANGE_SUCCESS);
        }

        if (CombinedGraphQLErrors.is(error)) {
          this.error.set(error.errors[0] as ApiError);
        }
      });
  }
}
