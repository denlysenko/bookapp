import { Component } from '@angular/core';

import { AuthPageBase } from '@bookapp/angular/base';

import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

@Component({
  imports: [AuthFormComponent],
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent extends AuthPageBase {}
