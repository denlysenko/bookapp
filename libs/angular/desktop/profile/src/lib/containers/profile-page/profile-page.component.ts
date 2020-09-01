import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProfilePageBase } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';
import { AuthService, ProfileService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent extends ProfilePageBase {
  constructor(
    profileService: ProfileService,
    authService: AuthService,
    feedbackService: FeedbackPlatformService
  ) {
    super(profileService, authService, feedbackService);
  }
}
