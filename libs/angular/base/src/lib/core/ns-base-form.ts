import { ViewChild } from '@angular/core';

import { FeedbackPlatformService } from '@bookapp/angular/core';

import { RadDataForm } from 'nativescript-ui-dataform';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';

export abstract class NsBaseForm {
  constructor(protected readonly feedbackService: FeedbackPlatformService) {}

  @ViewChild('dataForm', { static: false })
  dataForm: RadDataFormComponent;

  get dataform(): RadDataForm {
    return this.dataForm.dataForm;
  }

  protected handleError(err: any) {
    console.log(err);
    if (err.message && err.message.message) {
      this.feedbackService.error(err.message.message);
      return;
    }

    Object.keys(err).forEach(key => {
      const formControl = this.dataform.getPropertyByName(key);

      if (formControl) {
        formControl.errorMessage = err[key].message;
        this.dataform.notifyValidated(key, false);
      }
    });
  }
}
