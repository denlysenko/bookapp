import { inject, Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { FeedbackPlatformService } from '@bookapp/angular/core';

@Injectable()
export class FeedbackService implements FeedbackPlatformService {
  readonly #snackBar = inject(MatSnackBar);

  success(msg: string) {
    this.#snackBar.open(msg, undefined, {
      panelClass: 'success-snackbar',
    });
  }

  error(msg: string) {
    this.#snackBar.open(msg, undefined, {
      panelClass: 'error-snackbar',
    });
  }
}
