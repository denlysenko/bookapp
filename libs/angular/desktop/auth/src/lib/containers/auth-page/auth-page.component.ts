import { Component, inject } from '@angular/core';

import { AuthPageBase } from '@bookapp/angular/base';
import { FeedbackPlatformService, WebauthnService } from '@bookapp/angular/core';

import { from, switchMap } from 'rxjs';

import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

@Component({
  imports: [AuthFormComponent],
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent extends AuthPageBase {
  readonly #webauthnService = inject(WebauthnService);
  readonly #feedbackService = inject(FeedbackPlatformService);

  loginWithPasskey() {
    this.loading.set(true);
    this.authService
      .startPasskeyAuthentication()
      .pipe(
        switchMap((options) => from(this.#webauthnService.getCredentials(options))),
        switchMap((credentials) => this.authService.verifyPasskeyAuthentication(credentials))
      )
      .subscribe({
        next: ({ data, errors }) => {
          this.loading.set(false);
          this.onNext({ data, errors });
        },
        error: () => {
          this.loading.set(false);
          this.#feedbackService.error('Error authenticating passkey');
        },
      });
  }
}
