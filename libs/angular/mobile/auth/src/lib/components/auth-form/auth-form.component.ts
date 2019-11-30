import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AuthFormBase } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';

@Component({
  moduleId: module.id,
  selector: 'bookapp-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent extends AuthFormBase {
  submitting = false;

  constructor(feedbackService: FeedbackPlatformService, fb: FormBuilder, cdr: ChangeDetectorRef) {
    super(feedbackService, fb, cdr);
  }

  submit() {
    this.submitting = true;
    super.submit();
  }
}
