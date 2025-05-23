import { Injectable } from '@angular/core';

import { FeedbackPlatformService } from '@bookapp/angular/core';

import { Feedback } from 'nativescript-feedback';

@Injectable()
export class FeedbackService implements FeedbackPlatformService {
  readonly #feedback = new Feedback();

  success(message: string) {
    this.#feedback.success({
      title: 'Success',
      message,
    });
  }

  error(message: string) {
    this.#feedback.error({
      title: 'Error',
      message,
    });
  }
}
