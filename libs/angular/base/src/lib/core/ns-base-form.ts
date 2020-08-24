import { ViewChild, Directive } from '@angular/core';

import { FeedbackPlatformService } from '@bookapp/angular/core';

@Directive()
export abstract class NsBaseForm {
  constructor(protected readonly feedbackService: FeedbackPlatformService) {}

  @ViewChild('dataForm')
  // use any for now because of jest transform error
  dataForm: any;

  get dataform() {
    return this.dataForm.dataForm;
  }

  protected handleError(err: any) {
    if (err.message && err.message.message) {
      this.feedbackService.error(err.message.message);
      return;
    }

    Object.keys(err).forEach((key) => {
      const formControl = this.dataform.getPropertyByName(key);

      if (formControl) {
        formControl.errorMessage = err[key].message;
        this.dataform.notifyValidated(key, false);
      }
    });
  }
}
