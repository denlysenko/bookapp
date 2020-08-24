import { FormGroup } from '@angular/forms';

import { FeedbackPlatformService } from '@bookapp/angular/core';

import { BaseComponent } from './base-component';

export abstract class BaseForm extends BaseComponent {
  form: FormGroup;
  errors: { [key: string]: string } = {};

  constructor(protected readonly feedbackService: FeedbackPlatformService) {
    super();
  }

  protected handleError(err: any) {
    if (err.message) {
      this.feedbackService.error(err.message);
      return;
    }

    Object.keys(err).forEach((key) => {
      const formControl = this.form.get(key);

      if (formControl) {
        formControl.setErrors({ serverError: true });
        this.errors[key] = err[key].message;
      }
    });
  }
}
