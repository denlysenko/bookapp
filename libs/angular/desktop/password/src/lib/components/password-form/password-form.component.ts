import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PasswordFormBase } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';

@Component({
  selector: 'bookapp-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordFormComponent extends PasswordFormBase {
  constructor(
    feedbackService: FeedbackPlatformService,
    private readonly fb: FormBuilder
  ) {
    super(feedbackService);
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }

  protected initForm() {
    this.form = this.fb.group({
      newPassword: [null, Validators.required],
      oldPassword: [null, Validators.required]
    });
  }
}
