import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BaseForm } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';
import { ProfileForm, User } from '@bookapp/shared';

@Component({
  selector: 'bookapp-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent extends BaseForm {
  form = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]]
  });

  @Input() loading: boolean;

  @Input()
  set user(user: User) {
    if (user) {
      this._userId = user._id;
      this.form.patchValue(user);
    }
  }

  @Input()
  set error(error: any) {
    if (error) {
      this.handleError(error);
    }
  }

  @Output() formSubmitted = new EventEmitter<ProfileForm>();

  private _userId: any;

  constructor(feedbackService: FeedbackPlatformService, private readonly fb: FormBuilder) {
    super(feedbackService);
  }

  get userId() {
    return this._userId;
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit({ id: this.userId, user: this.form.value });
    }
  }
}
