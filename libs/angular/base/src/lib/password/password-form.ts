import { EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BaseForm } from '../core/base-form';

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
}

export abstract class PasswordFormBase extends BaseForm implements OnInit {
  @Input() loading: boolean;

  @Input()
  set error(error: any) {
    if (error) {
      this.handleError(error);
    }
  }

  @Output() formSubmitted = new EventEmitter<PasswordForm>();

  protected abstract initForm(): void;

  ngOnInit() {
    this.initForm();
  }

  abstract submit(): void;
}
