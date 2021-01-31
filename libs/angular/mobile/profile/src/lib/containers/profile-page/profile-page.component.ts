import { Component } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

import { ProfilePageBase } from '@bookapp/angular/base';
import { FeedbackPlatformService, LoaderPlatformService } from '@bookapp/angular/core';
import { AuthService, ProfileService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent extends ProfilePageBase {
  constructor(
    profileService: ProfileService,
    authService: AuthService,
    feedbackService: FeedbackPlatformService,
    private readonly loaderService: LoaderPlatformService
  ) {
    super(profileService, authService, feedbackService);
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.loaderService.start() : this.loaderService.stop()));
  }
}
