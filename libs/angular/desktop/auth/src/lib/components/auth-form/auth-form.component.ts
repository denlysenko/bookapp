import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AuthFormBase } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';

@Component({
  selector: 'bookapp-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent extends AuthFormBase {
  constructor(feedbackService: FeedbackPlatformService, fb: FormBuilder) {
    super(feedbackService, fb);
  }
}
