import { inject } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { errorsMap } from '@bookapp/shared/constants';
import { ApiError } from '@bookapp/shared/interfaces';

import { BaseComponent } from './base-component';

// explanation here: https://github.com/angular/angular/issues/47091#issuecomment-1211152093
type DerivedControlType<TControl> = { [key in keyof TControl]: AbstractControl<unknown> };

export abstract class BaseForm<T extends DerivedControlType<T>> extends BaseComponent {
  protected readonly feedbackService = inject(FeedbackPlatformService);

  abstract form: FormGroup<T>;
  errors: Record<string, string> = {};

  protected handleError(err: ApiError) {
    if (err.message && err.message !== 'ValidationError') {
      this.feedbackService.error(errorsMap[err.message] ?? err.message);
      return;
    }

    Object.keys(err.extensions?.errors ?? {}).forEach((key) => {
      const formControl = this.form.get(key);

      if (formControl) {
        formControl.setErrors({ serverError: true });
        const errorMessage =
          errorsMap[err.extensions.errors[key].message] ?? err.extensions.errors[key].message;
        this.errors[key] = errorMessage;
      }
    });
  }
}
