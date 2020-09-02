import { RouterExtensions } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { SignupCredentials } from '@bookapp/shared/interfaces';

import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

export abstract class AuthPageBase {
  private error = new BehaviorSubject<any | null>(null);
  private loading = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly authService: AuthService,
    private readonly routerExtensions: RouterExtensions
  ) {}

  get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get error$(): Observable<any | null> {
    return this.error.asObservable();
  }

  submit({ isLoggingIn, credentials }) {
    isLoggingIn ? this.login(credentials.email, credentials.password) : this.signup(credentials);
  }

  private login(email: string, password: string) {
    this.loading.next(true);
    this.authService
      .login(email, password)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe(this.onNext.bind(this));
  }

  private signup(credentials: SignupCredentials) {
    this.loading.next(true);
    this.authService
      .signup(credentials)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe(this.onNext.bind(this));
  }

  private onNext({ data, errors }) {
    if (data) {
      this.routerExtensions.navigate([''], {
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
      this.error.next(errors[errors.length - 1]);
    }
  }
}
