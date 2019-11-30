import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthErrorInterceptor } from '@bookapp/angular/shared';

import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NgShadowModule } from 'nativescript-ngx-shadow';

import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { AuthPageComponent } from './containers/auth-page/auth-page.component';

@NgModule({
  imports: [CommonModule, NativeScriptFormsModule, ReactiveFormsModule, NgShadowModule],
  declarations: [AuthPageComponent, AuthFormComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthErrorInterceptor,
      multi: true
    }
  ]
})
export class AuthModule {}
