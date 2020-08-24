import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NgShadowModule } from 'nativescript-ngx-shadow';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';

import { PasswordFormComponent } from './components/password-form/password-form.component';
import { PasswordPageComponent } from './containers/password-page/password-page.component';
import { PasswordRoutingModule } from './password-routing.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    CommonModule,
    NativeScriptUIDataFormModule,
    PasswordRoutingModule,
    NgShadowModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [PasswordPageComponent, PasswordFormComponent],
})
export class PasswordModule {}
