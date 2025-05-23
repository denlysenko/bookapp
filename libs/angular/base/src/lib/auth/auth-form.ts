import { Directive, effect, inject, Injector, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';

import { ApiError, SignupCredentials } from '@bookapp/shared/interfaces';

import { BaseForm } from '../core/base-form';

interface Form {
  readonly firstName: FormControl<string>;
  readonly lastName: FormControl<string>;
  readonly email: FormControl<string>;
  readonly password: FormControl<string>;
}

@Directive()
export abstract class AuthFormBase extends BaseForm<Form> implements OnInit {
  readonly loading = input(false);
  readonly error = input<ApiError>();

  readonly formSubmitted = output<{
    isLoggingIn: boolean;
    credentials: Partial<SignupCredentials>;
  }>();

  readonly #fb = inject(FormBuilder);
  readonly #injector = inject(Injector);

  readonly isLoggingIn = signal(true);

  ngOnInit() {
    effect(
      () => {
        const error = this.error();

        if (error) {
          this.handleError(error);
        }
      },
      { injector: this.#injector }
    );

    this.#initForm();
  }

  toggleAuthMode() {
    this.isLoggingIn.update((loggingIn) => !loggingIn);

    if (this.isLoggingIn()) {
      this.#disableFields();
    } else {
      this.#enableFields();
    }
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit({
        credentials: this.form.value,
        isLoggingIn: this.isLoggingIn(),
      });
    }
  }

  get #firstNameField(): AbstractControl {
    return this.form.get('firstName');
  }

  get #lastNameField(): AbstractControl {
    return this.form.get('lastName');
  }

  #initForm() {
    this.form = this.#fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.#disableFields();
  }

  #enableFields() {
    this.#firstNameField.enable();
    this.#lastNameField.enable();
  }

  #disableFields() {
    this.#firstNameField.disable();
    this.#lastNameField.disable();
  }
}
