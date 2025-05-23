import { ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AuthFormBase } from '@bookapp/angular/base';

import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';

@Component({
  selector: 'bookapp-auth-form',
  imports: [NativeScriptCommonModule, NativeScriptFormsModule, ReactiveFormsModule],
  templateUrl: './auth-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class AuthFormComponent extends AuthFormBase {
  form: FormGroup;

  readonly submitting = signal(false);

  submit() {
    this.submitting.set(true);
    super.submit();
  }
}
