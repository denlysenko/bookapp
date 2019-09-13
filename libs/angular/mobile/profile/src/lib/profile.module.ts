import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NgShadowModule } from 'nativescript-ngx-shadow';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';

import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { ProfilePageComponent } from './containers/profile-page/profile-page.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    CommonModule,
    ProfileRoutingModule,
    NativeScriptUIDataFormModule,
    NgShadowModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [ProfileFormComponent, ProfilePageComponent]
})
export class ProfileModule {}
