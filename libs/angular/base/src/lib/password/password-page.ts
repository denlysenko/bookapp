import { FeedbackPlatformService } from '@bookapp/angular/core';
import { PasswordService } from '@bookapp/angular/data-access';

import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

const PASSWORD_CHANGE_SUCCESS = 'Password changed!';

export abstract class PasswordPageBase {
  private error = new BehaviorSubject<any | null>(null);
  private loading = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly passwordService: PasswordService,
    private readonly feedbackService: FeedbackPlatformService
  ) {}

  get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get error$(): Observable<any | null> {
    return this.error.asObservable();
  }

  changePassword({ password, oldPassword }) {
    this.loading.next(true);

    this.passwordService
      .changePassword(password, oldPassword)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe(({ data, errors }) => {
        if (data && data.changePassword) {
          this.feedbackService.success(PASSWORD_CHANGE_SUCCESS);
        }

        if (errors) {
          this.error.next(errors[errors.length - 1]);
        }
      });
  }
}
