import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';

import { AuthPageBase } from '@bookapp/angular/base';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { Page } from '@nativescript/core';

import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

@Component({
  imports: [NativeScriptCommonModule, AuthFormComponent],
  templateUrl: './auth-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class AuthPageComponent extends AuthPageBase implements OnInit {
  readonly #page = inject(Page);

  ngOnInit() {
    this.#page.actionBarHidden = true;
  }
}
