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
import { ApiError, ProfileForm, User } from '@bookapp/shared/interfaces';

interface Form {
  readonly firstName: FormControl<string>;
  readonly lastName: FormControl<string>;
  readonly email: FormControl<string>;
}

@Component({
  selector: 'bookapp-profile-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent extends BaseForm<Form> implements OnInit {
  readonly loading = input(false);
  readonly error = input<ApiError>();
  readonly user = input<User>();

  readonly formSubmitted = output<ProfileForm>();

  readonly #fb = inject(FormBuilder);
  readonly #injector = inject(Injector);

  readonly form = this.#fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  #userId: string;

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

    effect(
      () => {
        const user = this.user();

        if (user) {
          this.#userId = user.id;
          this.form.patchValue(user);
        }
      },
      { injector: this.#injector }
    );
  }

  get userId() {
    return this.#userId;
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit({ id: this.userId, user: this.form.value });
    }
  }
}
