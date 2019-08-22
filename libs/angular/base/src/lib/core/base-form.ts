import { FormGroup } from '@angular/forms';

import { FeedbackPlatformService } from '@bookapp/angular/core';

export abstract class BaseForm {
  form: FormGroup;
  errors: { [key: string]: string } = {};

  constructor(protected readonly feedbackService: FeedbackPlatformService) {}

  protected handleError(err: any) {
    if (err.errors) {
      const error = err.errors;
      Object.keys(error).forEach(key => {
        const formControl = this.form.get(key);
        if (formControl) {
          formControl.setErrors({ serverError: true });
          this.errors[key] = error[key].message;
        }
      });
    } else if (err.message && err.message.message) {
      this.feedbackService.error(err.message.message);
    }
  }
}
