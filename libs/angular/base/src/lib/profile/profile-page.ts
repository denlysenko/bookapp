import { inject, signal } from '@angular/core';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { AuthService, ProfileService } from '@bookapp/angular/data-access';
import { ApiError } from '@bookapp/shared/interfaces';

import { finalize, map } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

const PROFILE_UPDATE_SUCCESS = 'Profile updated!';

export abstract class ProfilePageBase extends BaseComponent {
  readonly #profileService = inject(ProfileService);
  readonly #authService = inject(AuthService);
  readonly #feedbackService = inject(FeedbackPlatformService);

  readonly user$ = this.#authService.watchMe().pipe(map(({ data }) => data.me));

  readonly error = signal<ApiError | null>(null);
  readonly loading = signal<boolean>(false);

  updateProfile({ id, user }) {
    this.loading.set(true);

    this.#profileService
      .update(id, user)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe(({ data, errors }) => {
        if (data) {
          this.#feedbackService.success(PROFILE_UPDATE_SUCCESS);
        }

        if (errors) {
          this.error.set(errors[errors.length - 1]);
        }
      });
  }
}
