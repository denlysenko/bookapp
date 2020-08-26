import { FeedbackPlatformService } from '@bookapp/angular/core';
import { AuthFacade, ProfileService } from '@bookapp/angular/data-access';

import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

const PROFILE_UPDATE_SUCCESS = 'Profile updated!';

export abstract class ProfilePageBase {
  user$ = this.authFacade.me().pipe(map(({ data }) => data.me));

  private error = new BehaviorSubject<any | null>(null);
  private loading = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly profileService: ProfileService,
    private readonly authFacade: AuthFacade,
    private readonly feedbackService: FeedbackPlatformService
  ) {}

  get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get error$(): Observable<any | null> {
    return this.error.asObservable();
  }

  updateProfile({ id, user }) {
    this.loading.next(true);

    this.profileService
      .update(id, user)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe(({ data, errors }) => {
        if (data) {
          this.feedbackService.success(PROFILE_UPDATE_SUCCESS);
        }

        if (errors) {
          this.error.next(errors[errors.length - 1]);
        }
      });
  }
}
