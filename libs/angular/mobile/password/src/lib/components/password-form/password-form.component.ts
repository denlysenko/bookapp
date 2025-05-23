/* eslint-disable no-unused-private-class-members */
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  NO_ERRORS_SCHEMA,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { BaseForm } from '@bookapp/angular/base';
import { ApiError, PasswordForm } from '@bookapp/shared/interfaces';

import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';

interface Form {
  readonly oldPassword: FormControl<string>;
  readonly password: FormControl<string>;
}

@Component({
  selector: 'bookapp-password-form',
  imports: [NativeScriptCommonModule, NativeScriptFormsModule, ReactiveFormsModule],
  templateUrl: './password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class PasswordFormComponent extends BaseForm<Form> {
  readonly loading = input(false);
  readonly error = input<ApiError>();

  readonly formSubmitted = output<PasswordForm>();

  readonly #fb = inject(FormBuilder);
  readonly #errorEffect = effect(() => {
    const error = this.error();

    if (error) {
      this.handleError(error);
    }
  });

  readonly form = this.#fb.group({
    oldPassword: ['', Validators.required],
    password: ['', Validators.required],
  });

  readonly submitting = signal(false);

  submit() {
    this.submitting.set(true);

    if (this.form.valid) {
      const { oldPassword, password } = this.form.value;

      this.formSubmitted.emit({
        oldPassword,
        password,
      });
    }
  }
}
