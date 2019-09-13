import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NgShadowModule } from 'nativescript-ngx-shadow';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    CommonModule,
    NativeScriptUIDataFormModule,
    NgShadowModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProfileModule {}
