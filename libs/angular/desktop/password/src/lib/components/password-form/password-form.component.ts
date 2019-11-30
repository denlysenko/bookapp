import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BaseForm } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';
import { PasswordForm } from '@bookapp/shared';

@Component({
  selector: 'bookapp-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordFormComponent extends BaseForm {
  form = this.fb.group({
    password: [null, Validators.required],
    oldPassword: [null, Validators.required]
  });

  @Input() loading: boolean;

  @Input()
  set error(error: any) {
    if (error) {
      this.handleError(error);
    }
  }

  @Output() formSubmitted = new EventEmitter<PasswordForm>();

  constructor(feedbackService: FeedbackPlatformService, private readonly fb: FormBuilder) {
    super(feedbackService);
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }
}
