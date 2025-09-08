import { inject, signal } from '@angular/core';

import { RouterExtensions } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { ApiError, SignupCredentials } from '@bookapp/shared/interfaces';

import { finalize } from 'rxjs/operators';

export abstract class AuthPageBase {
  readonly #routerExtensions = inject(RouterExtensions);
  protected readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<ApiError>(null);

  submit({ isLoggingIn, credentials }) {
    if (isLoggingIn) {
      this.#login(credentials.email, credentials.password);
    } else {
      this.#signup(credentials);
    }
  }

  protected onNext({ data, errors }) {
    if (data) {
      this.#routerExtensions.navigate([''], {
        // for nativescript
        clearHistory: true,
        transition: {
          name: 'flip',
          duration: 300,
          curve: 'linear',
        },
      });
    }

    if (errors) {
      this.error.set(errors[errors.length - 1]);
    }
  }

  #login(email: string, password: string) {
    this.loading.set(true);
    this.authService
      .login(email, password)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe(this.onNext.bind(this));
  }

  #signup(credentials: SignupCredentials) {
    this.loading.set(true);
    this.authService
      .signup(credentials)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe(this.onNext.bind(this));
  }
}
