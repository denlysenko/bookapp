import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { PasswordPageBase } from '@bookapp/angular/base';

import { PasswordFormComponent } from '../../components/password-form/password-form.component';

@Component({
  imports: [MatCardModule, PasswordFormComponent],
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordPageComponent extends PasswordPageBase {}
