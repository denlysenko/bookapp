import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseForm } from '@bookapp/angular/base';
import { ApiError, PasswordForm } from '@bookapp/shared/interfaces';

interface Form {
  readonly password: FormControl<string>;
  readonly oldPassword: FormControl<string>;
}

@Component({
  selector: 'bookapp-password-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFormComponent extends BaseForm<Form> implements OnInit {
  readonly loading = input(false);
  readonly error = input<ApiError>();

  readonly formSubmitted = output<PasswordForm>();

  readonly #fb = inject(FormBuilder);
  readonly #injector = inject(Injector);

  readonly form = this.#fb.group({
    password: ['', Validators.required],
    oldPassword: ['', Validators.required],
  });

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
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value as PasswordForm);
    }
  }
}
