import { FormGroup } from '@angular/forms';

import { FeedbackPlatformService } from '@bookapp/angular/core';

export abstract class BaseForm {
  form: FormGroup;
  errors: { [key: string]: string } = {};

  constructor(protected readonly feedbackService: FeedbackPlatformService) {}

  protected handleError(err: any) {
    if (err.message && err.message.message) {
      this.feedbackService.error(err.message.message);
      return;
    }

    Object.keys(err).forEach(key => {
      const formControl = this.form.get(key);

      if (formControl) {
        formControl.setErrors({ serverError: true });
        this.errors[key] = err[key].message;
      }
    });
  }
}
