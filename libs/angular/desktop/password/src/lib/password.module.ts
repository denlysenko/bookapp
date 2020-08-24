import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PasswordFormComponent } from './components/password-form/password-form.component';
import { PasswordPageComponent } from './containers/password-page/password-page.component';
import { PasswordRoutingModule } from './password-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [PasswordFormComponent, PasswordPageComponent],
})
export class PasswordModule {}
