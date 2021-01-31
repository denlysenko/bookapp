import { Component } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

import { PasswordPageBase } from '@bookapp/angular/base';
import { FeedbackPlatformService, LoaderPlatformService } from '@bookapp/angular/core';
import { PasswordService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.scss'],
})
export class PasswordPageComponent extends PasswordPageBase {
  constructor(
    passwordService: PasswordService,
    feedbackService: FeedbackPlatformService,
    private readonly loaderService: LoaderPlatformService
  ) {
    super(passwordService, feedbackService);
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.loaderService.start() : this.loaderService.stop()));
  }
}
