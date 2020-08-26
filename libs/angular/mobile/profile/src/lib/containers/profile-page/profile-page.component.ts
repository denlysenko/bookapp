import { Component } from '@angular/core';

import { ProfilePageBase } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';
import { AuthFacade, ProfileService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent extends ProfilePageBase {
  constructor(
    profileService: ProfileService,
    authFacade: AuthFacade,
    feedbackService: FeedbackPlatformService
  ) {
    super(profileService, authFacade, feedbackService);
  }
}
