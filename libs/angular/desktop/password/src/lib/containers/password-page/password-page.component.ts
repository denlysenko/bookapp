import { Component } from '@angular/core';

import { PasswordPageBase } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';
import { PasswordService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.scss'],
})
export class PasswordPageComponent extends PasswordPageBase {
  constructor(passwordService: PasswordService, feedbackService: FeedbackPlatformService) {
    super(passwordService, feedbackService);
  }
}
